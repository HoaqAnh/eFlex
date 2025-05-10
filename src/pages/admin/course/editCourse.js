import React, { useEffect } from "react";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/editCourse/footer";
import Header from "../../../components/admin/course/addCourse/header";
import getCourseDetail from "../../../hooks/course/useCourse";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCourse } from "../../../hooks/admin/useCourse";
import { useCategory } from "../../../hooks/useCategory";
import "../../../styles/admin/editCourse/style.css";

const EditCourse = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    const { id } = useParams();
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategory();
    const {
        loading: addCourseLoading,
        error: addCourseError,
        formErrors,
        imagePreview, selectedImage,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleNavigate,
        handleUpdate,
        handleUpdateAndNext,
    } = useCourse();

    const { courseDetail } = getCourseDetail(id);

    useEffect(() => {
        if (!courseDetail) {
            handleNavigate("course");
        }
    }, [courseDetail, handleNavigate]);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="editCourse">
            {addCourseError && <div className="error-message">{addCourseError}</div>}
            {addCourseLoading ? (
                <div className="editCourse-isLoading">
                    <div className="editCourse-isLoading__title">
                        Đang lấy thông tin khóa học...
                    </div>
                    <div className="editCourse-isLoading__loader"></div>
                </div>
            ) : (
                <>
                    <Header
                        Title="Chỉnh sửa khóa học"
                    />
                    <Body
                        courseData={courseDetail}
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                        categoriesError={categoriesError}
                        imagePreview={imagePreview}
                        selectedImage={selectedImage}
                        formErrors={formErrors}
                        handleInputChange={handleInputChange}
                        handleImageSelect={handleImageSelect}
                        handleRemoveImage={handleRemoveImage}
                    />
                    <Footer
                        handleBack={() => handleNavigate("course")}
                        handleUpdate={handleUpdate}
                        handleUpdateAndNext={handleUpdateAndNext}
                    />
                </>
            )}
        </div>
    );
}

export default EditCourse;

