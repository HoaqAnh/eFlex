import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/admin/layout/navbar";
import Sidebar from "../../components/admin/layout/sidebar";
import CourseHeader from "../../components/admin/course/CourseHeader";
import CourseGrid from "../../components/admin/course/CourseGrid";
import CourseFooter from "../../components/admin/course/CourseFooter";
import PreviewCourse from "../../components/admin/course/PreviewCourse";

//data
import { filterOptions } from "../../data/courseData";

//hooks
import { useCoursePanel } from "../../hooks/admin/useCoursePanel";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/admin/coursePanel.css";
import "../../styles/button/style.css";

function CoursePanel() {
    const {
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
        handleClosePreview
    } = useCoursePanel();

    const { isAdmin, isAuthenticated, isLoading, error } = useAuth();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="course-panel">
            <Navbar />
            <div className="course-panel__content-wrapper">
                <Sidebar />
                <div className="course-panel__main-content">
                    <CourseHeader 
                        selectAll={selectAll}
                        onSelectAll={handleSelectAll}
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        filterOptions={filterOptions}
                        selectedFilter={selectedFilter}
                        onFilterChange={handleFilterChange}
                    />

                    <CourseGrid
                        courses={filteredCourses}
                        selectedCourses={selectedCourses}
                        onSelectCourse={handleSelectCourse}
                        onPreview={handlePreviewCourse}
                    />

                    <CourseFooter
                        onAddCourse={handleAddCourse}
                        selectedCoursesCount={selectedCourses.length}
                    />
                </div>
            </div>

            {previewCourse && (
                <PreviewCourse
                    course={previewCourse}
                    onClose={handleClosePreview}
                />
            )}
        </div>
    );
}

export default CoursePanel;