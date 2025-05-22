import React, { useEffect } from "react";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/editCourse/footer";
import Header from "../../../components/admin/course/addCourse/header";
import Loading from "../../../components/layout/loader/loading"
import { useCourseDetail } from "../../../hooks/course/useCourse";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useAdminCourse } from "../../../hooks/course/useCourse";
import { useCategory } from "../../../hooks/course/useCategory";
import "../../../styles/admin/editCourse/style.css";

const EditCourse = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    const { id } = useParams();
    const { categoryData, loading: categoriesLoading, error: categoriesError } = useCategory();
    const {
        loading: editCourseLoading,
        error: editCourseError,
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

    const loading = categoriesLoading || editCourseLoading || courseLoading;
    const error = categoriesError || editCourseError || courseError;

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="editCourse">
            {error && <div className="error-message">Có lỗi xảy ra vui lòng thử lại sau ít phút.</div>}
            {loading ? (
                <Loading Title="Đang xử lý yêu cầu của bạn..." />
            ) : (
                <>
                    <Header
                        Title="Chỉnh sửa khóa học"
                    />
                    <Body
                        courseDetail={courseDetail}
                        categories={categoryData}
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