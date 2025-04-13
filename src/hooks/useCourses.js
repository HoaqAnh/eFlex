import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:8080/api/v1";

export const useCourses = () => {
    const navigate = useNavigate();

    // States
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [previewCourse, setPreviewCourse] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
        pages: 0
    });

    // Fetch courses from API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
        
                // Lấy token từ localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
                }
                
                const response = await fetch(`${BASE_URL}/courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    } else {
                        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
                    }
                }

                const responseData = await response.json();
                
                // Truy cập đúng cấu trúc dữ liệu theo API
                if (responseData.data && 
                    responseData.data.result && 
                    Array.isArray(responseData.data.result.content)) {
                    
                    // Truy cập mảng courses trong cấu trúc dữ liệu
                    const coursesData = responseData.data.result.content;
                    
                    /* Cập nhật thông tin phân trang */
                    if (responseData.data.meta) {
                        setPagination({
                            page: responseData.data.meta.page,
                            pageSize: responseData.data.meta.pageSize,
                            total: responseData.data.meta.total,
                            pages: responseData.data.meta.pages
                        });
                    } else if (responseData.data.result.page) {
                        setPagination({
                            page: responseData.data.result.page.number + 1,
                            pageSize: responseData.data.result.page.size,
                            total: responseData.data.result.page.totalElements,
                            pages: responseData.data.result.page.totalPages
                        });
                    }
                    
                    // Chuyển đổi dữ liệu API thành định dạng ứng dụng
                    const formattedCourses = coursesData.map(course => ({
                        id: course.id,
                        title: course.tenMon,
                        image: course.anhMonHoc,
                        description: course.moTa,
                        status: 'active',
                        createdAt: course.ngayTao,
                        updatedAt: course.ngayCapNhat,
                        createdBy: course.createdBy,
                        updatedBy: course.updatedBy,
                        category: course.category
                    }));

                    setCourses(formattedCourses);
                } else {
                    throw new Error("Cấu trúc dữ liệu không đúng định dạng");
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
                setLoading(false);
                
                // Nếu lỗi là do xác thực, chuyển hướng đến trang đăng nhập
                if (err.message.includes("đăng nhập lại")) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchCourses();
    }, [navigate]);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !selectedFilter || course.status === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [courses, searchTerm, selectedFilter]);

    // Handlers
    const handleAddCourse = () => {
        navigate("/coursePanel/addCourse");
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        setSelectedCourses(isChecked ? filteredCourses.map(course => course.id) : []);
    };

    const handleSelectCourse = (courseId) => {
        setSelectedCourses(prev => {
            const isSelected = prev.includes(courseId);
            const newSelection = isSelected
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId];

            setSelectAll(newSelection.length === filteredCourses.length);
            return newSelection;
        });
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setSelectedCourses([]);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setSelectedCourses([]);
    };

    const handlePreviewCourse = (course) => {
        setPreviewCourse(course);
    };

    const handleClosePreview = () => {
        setPreviewCourse(null);
    };

    return {
        courses,
        loading,
        error,
        selectedCourses,
        selectAll,
        searchTerm,
        selectedFilter,
        previewCourse,
        filteredCourses,
        pagination,
        handleAddCourse,
        handleSelectAll,
        handleSelectCourse,
        handleSearch,
        handleFilterChange,
        handlePreviewCourse,
        handleClosePreview,
    };
};