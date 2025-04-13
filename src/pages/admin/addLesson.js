import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import LessonForm from "../../components/admin/course/addLessonForm";
import LessonActions from "../../components/admin/course/addLessonAction";

//hooks
import { useAddLesson } from "../../hooks/admin/useAddLesson";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/admin/addLesson.css";
import "../../styles/button/style.css";

function AddLesson() {
    const {
        lessonData,
        loading,
        error: addLessonError,
        formErrors,
        handleInputChange,
        handleSubmit,
        handleBack,
        handleAddLesson
    } = useAddLesson();

    const { isAdmin, isAuthenticated, isLoading, error } = useAuth();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="add-lesson">
            <Navbar />
            <div className="add-lesson__main-content">
                {addLessonError && <div className="error-message">{addLessonError}</div>}
                {loading ? (
                    <div className="loading-message">Đang thêm bài học...</div>
                ) : (
                    <>
                        <LessonForm
                            lessonData={lessonData}
                            formErrors={formErrors}
                            handleInputChange={handleInputChange}
                        />
                        <LessonActions
                            handleSubmit={handleSubmit}
                            handleBack={handleBack}
                            handleAddLesson={handleAddLesson}
                        />
                    </>
                )}
            </div>
        </div>
    );

}

export default AddLesson;