import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleCourses } from '../data/courseData';

export const useCoursePanel = () => {
    const navigate = useNavigate();

    // States
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [previewCourse, setPreviewCourse] = useState(null);

    // Filtered courses
    const filteredCourses = useMemo(() => {
        return sampleCourses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !selectedFilter || course.status === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, selectedFilter]);

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

    return {
        selectedCourses,
        selectAll,
        searchTerm,
        selectedFilter,
        previewCourse,
        filteredCourses,
        handleAddCourse,
        handleSelectAll,
        handleSelectCourse,
        handleSearch,
        handleFilterChange,
        handlePreviewCourse,
        handleClosePreview,
    };
}; 