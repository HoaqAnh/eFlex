import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/admin/layout/navbar";
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
        handleAddLesson,
        handleRemoveLesson,
        handleLessonChange,
        handleInputChange,
        handleSubmit,
        handleBack
    } = useAddCourse();

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
        <div className="add-course">
            <Navbar />
            <div className="add-course__main-content">
                <CourseForm
                    courseData={courseData}
                    handleInputChange={handleInputChange}
                    handleLessonChange={handleLessonChange}
                    handleAddLesson={handleAddLesson}
                    handleRemoveLesson={handleRemoveLesson}
                />
                <CourseActions
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

export default AddCourse;

