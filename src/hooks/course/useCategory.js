import { useEffect, useState, useCallback } from "react"
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


export const useFilterCategory = (categoryId) => {
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

}

// export const useFilter = (categoryId = null) => {
//     const navigate = useNavigate();
//     const [courseData, setCourseData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [paginationParams, setPaginationParams] = useState({
//         page: 0,
//         size: 10,
//         sort: 'id,asc',
//     });
//     const [currentCategoryId, setCurrentCategoryId] = useState(categoryId);

//     // Hàm fetch dữ liệu khóa học, được memoize với useCallback
//     // Nó sẽ chạy lại khi paginationParams hoặc currentCategoryId thay đổi
//     const fetchCoursesFiltered = useCallback(async () => {
//         setLoading(true);
//         setError(null); // Xóa lỗi cũ trước khi fetch

//         // Kiểm tra currentCategoryId hợp lệ
//         if (currentCategoryId === null || currentCategoryId === undefined) {
//             // Có thể muốn fetch tất cả khóa học nếu initialCategoryId là null/undefined
//             // hoặc báo lỗi nếu bắt buộc phải có categoryId
//             console.warn("CategoryId is null or undefined, fetching might not work as expected.");
//             // Nếu bạn muốn API /courses/filter/all hoặc tương tự, bạn có thể truyền 0 hoặc null
//             // Còn không, bạn có thể trả về sớm hoặc set lỗi
//             // setError("Vui lòng chọn một danh mục để lọc.");
//             // setLoading(false);
//             // return;
//         }


//         try {
//             // Gọi filterService với paginationParams và currentCategoryId
//             // filterService trả về 'content' của ResultPaginationDTO
//             const data = await filterService(paginationParams, currentCategoryId);

//             // filterService của bạn đã return responseData.data.result.content;
//             // nên 'data' ở đây đã là mảng content rồi.
//             if (data && Array.isArray(data)) {
//                 setCourseData(data);
//             } else {
//                 console.warn("Hook: Dữ liệu khóa học trả về không phải là mảng hoặc null.", data);
//                 setCourseData([]);
//                 setError("Dữ liệu khóa học không hợp lệ.");
//             }

//         } catch (err) {
//             console.error('Hook: Lỗi khi fetch dữ liệu khóa học:', err);
//             setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu khóa học.');

//             // Xử lý lỗi xác thực và chuyển hướng
//             if (err.message && err.message.includes("Phiên đăng nhập đã hết hạn.")) {
//                 toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
//                 setTimeout(() => {
//                     navigate('/login');
//                 }, 1500);
//             } else {
//                 toast.error(err.message || 'Lỗi tải khóa học.');
//             }
//         } finally {
//             setLoading(false); // Luôn tắt loading
//         }
//     }, [paginationParams, currentCategoryId, navigate]); // Dependencies của useCallback

//     // useEffect sẽ chạy lại mỗi khi fetchCoursesFiltered thay đổi
//     // fetchCoursesFiltered thay đổi khi paginationParams hoặc currentCategoryId thay đổi
//     useEffect(() => {
//         fetchCoursesFiltered();
//     }, [fetchCoursesFiltered]);

//     // Các hàm để thay đổi tham số phân trang và ID danh mục
//     // Các hàm này được export để component sử dụng hook có thể gọi
//     const setPage = useCallback((page) => {
//         setPaginationParams(prev => ({ ...prev, page }));
//     }, []);

//     const setSize = useCallback((size) => {
//         setPaginationParams(prev => ({ ...prev, size, page: 0 })); // Reset về trang 0 khi đổi size
//     }, []);

//     const setSort = useCallback((sort) => {
//         setPaginationParams(prev => ({ ...prev, sort, page: 0 })); // Reset về trang 0 khi đổi sort
//     }, []);

//     const setCategoryId = useCallback((id) => {
//         setCurrentCategoryId(id);
//         setPaginationParams(prev => ({ ...prev, page: 0 })); // Reset về trang 0 khi đổi danh mục
//     }, []);

//     // Trả về dữ liệu, trạng thái, và các hàm để thay đổi tham số
//     return {
//         courseData,
//         loading,
//         error,
//         pagination: paginationParams, // Trả về paginationParams hiện tại
//         setPage,
//         setSize,
//         setSort,
//         setCategoryId, // Hàm để thay đổi idCategory từ component
//     };
// };

