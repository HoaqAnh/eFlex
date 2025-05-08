import React from "react";

//components
import CourseHeader from "../../components/admin/course/CourseHeader";
import CourseGrid from "../../components/admin/course/CourseGrid";
import CourseFooter from "../../components/admin/course/CourseFooter";
import PreviewCourse from "../../components/admin/course/PreviewCourse";
import ConfirmDialog from "../../components/common/ConfirmDialog";

//data
import { filterOptions } from "../../data/courseData";

//hooks
import { useCourses } from "../../hooks/useCourses";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/admin/coursePanel.css";
import "../../styles/layout/previewCourse.css";
import "../../styles/layout/coursesGrid.css";
import "../../styles/button/style.css";

const CoursePanel = () => {
    const {
        loading: coursesLoading,
        selectedCourses,
        selectAll,
        searchTerm,
        selectedFilter,
        previewCourse,
        filteredCourses,
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
    } = useCourses();

    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="course-panel">
            <div className="course-panel__content-wrapper">
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

                    <CourseFooter
                        onAddCourse={handleAddCourse}
                        selectedCoursesCount={selectedCourses.length}
                        onDeleteCourses={handleDeleteClick}
                        isDeleting={coursesLoading}
                        onEditCourse={handleEditCourse}
                    />
                </div>
            </div>

            {previewCourse && (
                <PreviewCourse
                    course={previewCourse}
                    onClose={handleClosePreview}
                />
            )}

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa khóa học"
                message={`Bạn có chắc chắn muốn xóa ${selectedCourses.length} khóa học đã chọn? Hành động này không thể hoàn tác.`}
            />
        </div>
    );
}

export default CoursePanel;