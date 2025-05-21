import { useEffect, useState, useCallback, use } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { getAllCategory } from '../../services/categoryService';
import { filterService } from "../../services/filterService";

export const useCategory = () => {
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const responseData = await getAllCategory();
            if (!responseData) {
                setError('Không tìm thấy danh mục.');
                return;
            }

            setCategoryData(responseData.data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');

            if (err.message && err.message.includes("Authentication required")) {
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                toast.error(err.message || 'Lỗi tải danh mục.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    return { categoryData, loading, error };
}

export const useFilterCategory = (idCategory, paginationParams) => {
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    const fetchFilteredCourses = useCallback(async (currentIdCategory, currentPaginationParams) => {
        if (!currentIdCategory) {
            setFilterData([]);
            setHasMore(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const pageToFetch = currentPaginationParams.page !== undefined ? currentPaginationParams.page : 0;
            const response = await filterService({ page: pageToFetch, size: 10 }, currentIdCategory);

            if (response && response.success === false) {
                setError(response.error || "Lỗi hệ thống khi lọc khóa học.");
                setHasMore(false);
                setFilterData([]);
                if (response.error && response.error.includes("Authentication required")) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    toast.error(response.error || "Lỗi tải dữ liệu lọc.");
                }
            } else if (response && Array.isArray(response)) {
                if (pageToFetch === 0) {
                    setFilterData(response);
                } else {
                    setFilterData(prevData => [...prevData, ...response]);
                }
                setHasMore(response.length > 0 && response.length === 10);
            } else {
                if (pageToFetch === 0) setFilterData([]);
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error in useFilterCategory fetchFilteredCourses:", err);
            setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu lọc.');
            setFilterData([]);
            setHasMore(false);
            toast.error(err.message || 'Lỗi tải dữ liệu lọc.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (idCategory) {
            fetchFilteredCourses(idCategory, paginationParams);
        } else {
            setFilterData([]);
            setLoading(false);
            setError(null);
            setHasMore(false);
        }
    }, [idCategory, paginationParams, fetchFilteredCourses]);

    return { filterData, loading, error, hasMore };
};