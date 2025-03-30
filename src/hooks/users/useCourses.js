import { useState, useMemo, useCallback } from 'react';
import { sampleCourses } from '../../data/courseData';
import { getAllCourse, getCourse } from '../../services/CourseService';

export const useCourses = () => {
    // States
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [previewCourse, setPreviewCourse] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [listCourse, setListCourse] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasFetchedCourses, setHasFetchedCourses] = useState(false);
    const [hasFetchedCourse, setHasFetchedCourse] = useState(false);
    const pageSize = 10;

    // Filtered courses
    const filteredCourses = useMemo(() => {
        return sampleCourses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !selectedFilter || course.status === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, selectedFilter]);

    // Handlers
    const handleSearch = (term) => {
        setSearchTerm(term);
        setSelectedCourses([]); // Reset selection when searching
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setSelectedCourses([]); // Reset selection when filtering
    };

    const handlePreviewCourse = (course) => {
        setPreviewCourse(course);
    };

    const handleClosePreview = () => {
        setPreviewCourse(null);
    };

    // Hàm lấy danh sách khóa học
    const fetchCourses = useCallback(
        async (page = 1) => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllCourse(page, pageSize);
                if (data?.data?.result) {
                    setListCourse(data.data.result.content || []);
                    setTotalPages(data.data.result.totalPages || 1);
                    setCurrentPage(page);
                    setHasFetchedCourses(true);
                } else {
                    throw new Error("Invalid data format");
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError("Không thể tải danh sách khóa học.");
                setListCourse([]);
            } finally {
                setLoading(false);
            }
        },
        [pageSize]
    );

    // Hàm lấy thông tin chi tiết khóa học theo id
    const fetchCourseById = useCallback(
        async (id) => {
            if (!id) {
                setError("ID khóa học không hợp lệ");
                return null;
            }

            try {
                setLoading(true);
                setError(null);
                const courseData = await getCourse(id);
                if (courseData?.data) {
                    setCourse(courseData.data);
                    setHasFetchedCourse(true);
                    return courseData.data;
                } else {
                    throw new Error("Không tìm thấy khóa học");
                }
            } catch (error) {
                console.error("Error fetching course by id:", error);
                setError("Không thể tải thông tin khóa học.");
                setCourse(null);
                setHasFetchedCourse(false);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        selectedCourses,
        searchTerm,
        selectedFilter,
        previewCourse,
        filteredCourses,
        listCourse,
        course,
        loading,
        error,
        totalPages,
        currentPage,
        handleSearch,
        handleFilterChange,
        handlePreviewCourse,
        handleClosePreview,
        fetchCourses,
        fetchCourseById
    };
}; 