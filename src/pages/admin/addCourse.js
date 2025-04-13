import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import CourseForm from "../../components/admin/course/addCourseForm";
import CourseActions from "../../components/admin/course/addCourseActions";

//hooks
import { useAddCourse } from "../../hooks/admin/useAddCourse";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/admin/addCourse.css";
import "../../styles/button/style.css";

function AddCourse() {
    const {
        courseData,
        loading,
        error: addCourseError,
        formErrors,
        imagePreview,
        selectedImage,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleSubmit,
        handleBack,
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
        <div className="add-course">
            <Navbar />
            <div className="add-course__main-content">
                {addCourseError && <div className="error-message">{addCourseError}</div>}
                {loading ? (
                    <div className="loading-message">Đang thêm khóa học...</div>
                ) : (
                    <>
                        <CourseForm
                            courseData={courseData}
                            imagePreview={imagePreview}
                            selectedImage={selectedImage}
                            formErrors={formErrors}
                            handleInputChange={handleInputChange}
                            handleImageSelect={handleImageSelect}
                            handleRemoveImage={handleRemoveImage}
                        />
                        <CourseActions
                            handleBack={handleBack}
                            handleSubmit={handleSubmit}
                            handleNext={handleNext}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default AddCourse;
