import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, deleteCourse } from '../services/courseService';

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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
        pages: 0
    });

    // Fetch courses from API
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const { courses: fetchedCourses, pagination: fetchedPagination } = await fetchCourses();
                setCourses(fetchedCourses);
                if (fetchedPagination) {
                    setPagination(fetchedPagination);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
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

    const handleDeleteClick = () => {
        if (selectedCourses.length === 0) {
            setError("Vui lòng chọn ít nhất một khóa học để xóa");
            return;
        }
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            setShowDeleteConfirm(false);

            // Xóa từng khóa học một
            for (const courseId of selectedCourses) {
                await deleteCourse(courseId);
            }

            // Cập nhật lại danh sách khóa học sau khi xóa
            const { courses: updatedCourses, pagination: updatedPagination } = await fetchCourses();
            setCourses(updatedCourses);
            if (updatedPagination) {
                setPagination(updatedPagination);
            }

            // Reset các state liên quan
            setSelectedCourses([]);
            setSelectAll(false);
            setError(null);
        } catch (error) {
            console.error('Error deleting courses:', error);
            setError(error.message || 'Không thể xóa khóa học. Vui lòng thử lại sau.');

            if (error.message.includes("đăng nhập lại")) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const handleEditCourse = () => {
        if (selectedCourses.length === 0) {
            setError("Vui lòng chọn một khóa học để chỉnh sửa");
            return;
        }
        if (selectedCourses.length > 1) {
            setError("Chỉ có thể chỉnh sửa một khóa học tại một thời điểm");
            return;
        }
        navigate(`/coursePanel/editCourse/${selectedCourses[0]}`);
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
        showDeleteConfirm,
        handleAddCourse,
        handleSelectAll,
        handleSelectCourse,
        handleSearch,
        handleFilterChange,
        handlePreviewCourse,
        handleClosePreview,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleEditCourse
    };
};