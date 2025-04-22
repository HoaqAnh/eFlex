import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../../components/navbar";
import Header from "../../../components/admin/course/addCourse/header";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/addCourse/footer";

//hooks
import { useAddCourse } from "../../../hooks/admin/useAddCourse";
import { useAuth } from "../../../hooks/useAuth";

//styles
import "../../../styles/admin/addCourse/style.css";
import "../../../styles/button/style.css";

const AddCourse = () => {
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
    } = useAddCourse();

    const { isAdmin, isAuthenticated, isLoading, error: authError } = useAuth();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (authError) {
        return <div className="error">Có lỗi xảy ra: {authError}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="addCourse">
            <Navbar />
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