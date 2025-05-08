import React from "react";

//components
import Header from "../../../components/admin/course/addCourse/header";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/addCourse/footer";

//hooks
import { useCourse } from "../../../hooks/admin/useCourse";
import { useAuth } from "../../../hooks/useAuth";

//styles
import "../../../styles/admin/addCourse/style.css";
import "../../../styles/button/style.css";

const AddCourse = () => {
    const { checkAuth } = useAuth();
    const {
        courseData,
        loading, 
        error: addCourseError, 
        formErrors,
        imagePreview, selectedImage,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleBack,
        handleSubmitDraft,
        handleNext
    } = useCourse();

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="addCourse">
            <div className="addCourse__main-content">
                <Header />
                {addCourseError && <div className="error-message">{addCourseError}</div>}
                {loading ? (
                    <div className="loading-message">Đang thêm khóa học...</div>
                ) : (
                    <>
                        <div className="addCourse__content-wrapper">
                            <Body
                                courseData={courseData}
                                imagePreview={imagePreview}
                                selectedImage={selectedImage}
                                formErrors={formErrors}
                                handleInputChange={handleInputChange}
                                handleImageSelect={handleImageSelect}
                                handleRemoveImage={handleRemoveImage}
                            />
                        </div>
                        <Footer
                            handleBack={handleBack}
                            handleSubmitDraft={handleSubmitDraft}
                            handleNext={handleNext}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default AddCourse;