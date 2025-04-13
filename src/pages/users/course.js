import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import Sidebar from "../../components/users/layout/sidebar";
import CourseHeader from "../../components/users/course/CourseHeader";
import CourseGrid from "../../components/users/course/CourseGrid";
import PreviewCourse from "../../components/users/course/PreviewCourse";

//data
import { filterOptions } from "../../data/courseData";

//hooks
import { useCourses } from "../../hooks/useCourses";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/users/course.css";
import "../../styles/layout/previewCourse.css";
import "../../styles/layout/coursesGrid.css";

function Course() {
    const {
        loading: coursesLoading,
        error: coursesError,
        selectedCourses,
        searchTerm,
        selectedFilter,
        previewCourse,
        filteredCourses,
        handleSelectCourse,
        handleSearch,
        handleFilterChange,
        handlePreviewCourse,
        handleClosePreview
    } = useCourses();

    const { isAuthenticated, isLoading, error } = useAuth();

    if (isLoading || coursesLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (coursesError) {
        return <div className="error">Có lỗi khi tải khóa học: {coursesError}</div>;
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
                        selectedFilter={selectedFilter}
                        onFilterChange={handleFilterChange}
                    />

                    {filteredCourses.length > 0 ? (
                        <CourseGrid
                            courses={filteredCourses}
                            selectedCourses={selectedCourses}
                            onSelectCourse={handleSelectCourse}
                            onPreview={handlePreviewCourse}
                        />
                    ) : (
                        <div className="no-courses">
                            {searchTerm || selectedFilter ?
                                "Không tìm thấy khóa học phù hợp với điều kiện tìm kiếm." :
                                "Không có khóa học nào. Hãy thêm khóa học mới."}
                        </div>
                    )}
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

export default Course;