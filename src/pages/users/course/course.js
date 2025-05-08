import React from "react";

//components
import CourseHeader from "../../../components/users/course/CourseHeader";
import CourseGrid from "../../../components/users/course/CourseGrid";
import PreviewCourse from "../../../components/users/course/PreviewCourse";

//data
import { filterOptions } from "../../../data/courseData";

//hooks
import { useCourses } from "../../../hooks/useCourses";
import { useAuth } from "../../../hooks/useAuth";

//style
import "../../../styles/users/course.css";
import "../../../styles/layout/previewCourse.css";
import "../../../styles/layout/coursesGrid.css";

const Course = () => {
    const {
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

    const { checkAuth } = useAuth();

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="course">
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