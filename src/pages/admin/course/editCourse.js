import React, { useEffect } from "react";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/editCourse/footer";
import Header from "../../../components/admin/course/addCourse/header";
import Loading from "../../../components/layout/loader/loading"
import { useCourseDetail } from "../../../hooks/course/useCourse";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useAdminCourse } from "../../../hooks/course/useCourse";
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
    } = useAdminCourse();

    const { courseDetail, loading: courseLoading, error: courseError } = useCourseDetail(id);

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
            {(addCourseError || courseError) && <div className="error-message">{addCourseError}</div>}
            {(addCourseLoading || courseLoading) ? (
                <Loading Title="Đang xử lý yêu cầu của bạn..."/>
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