import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/users/layout/navbar";
import Sidebar from "../../components/users/layout/sidebar";
import CourseHeader from "../../components/users/course/CourseHeader";
import CourseGrid from "../../components/users/course/CourseGrid";
import PreviewCourse from "../../components/users/course/PreviewCourse";

//data
import { filterOptions } from "../../data/courseData";

//hooks
import { useCourses } from "../../hooks/users/useCourses";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/users/course.css";

function CoursePanel() {
    const {
        selectedCourses,
        searchTerm,
        previewCourse,
        filteredCourses,
        handleSearch,
        handleFilterChange,
        handlePreviewCourse,
        handleClosePreview
    } = useCourses();

    const { isAuthenticated, isLoading, error } = useAuth();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="course">
            <Navbar />
            <div className="course__content-wrapper">
                <Sidebar />
                <div className="course__main-content">
                    <CourseHeader 
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        filterOptions={filterOptions}
                        onFilterChange={handleFilterChange}
                    />

                    <CourseGrid
                        courses={filteredCourses}
                        selectedCourses={selectedCourses}
                        onPreview={handlePreviewCourse}
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