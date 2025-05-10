import React from "react";
import Header from "../../../components/admin/course/addCourse/header";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/addCourse/footer";
import { useCourse } from "../../../hooks/admin/useCourse";
import { useAuth } from "../../../hooks/useAuth";
import { useCategory } from "../../../hooks/useCategory";
import "../../../styles/admin/addCourse/style.css";
import "../../../styles/button/style.css";

const AddCourse = () => {
    const { checkAuth } = useAuth();
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError
    } = useCategory();
    const {
        courseData,
        loading: addCourseLoading,
        error: addCourseError,
        formErrors,
        imagePreview, selectedImage,
        handleNavigate,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleSubmitDraft,
        handleNext
    } = useCourse();

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="addCourse">
            {addCourseError && <div className="error-message">{addCourseError}</div>}
            {addCourseLoading ? (
                <div className="addCourse-isLoading">
                    <div className="addCourse-isLoading__title">
                        Đang tải lên khóa học...
                    </div>
                    <div className="addCourse-isLoading__loader"></div>
                </div>
            ) : (
                <>
                    <Header
                        Title={"Thêm khóa học"}
                    />
                    <Body
                        courseData={courseData}
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
                        handleSubmitDraft={handleSubmitDraft}
                        handleNext={handleNext}
                    />
                </>
            )}
        </div>
    );
}

export default AddCourse;