import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/admin/layout/navbar";
import LessonForm from "../../components/admin/course/addLessonForm";
import LessonActions from "../../components/admin/course/addLessonAction";

//hooks
import { useAddCourse } from "../../hooks/admin/useAddCourse";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/admin/addLesson.css";
import "../../styles/button/style.css";

function AddLesson() {
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

    return(
        <div className="add-lesson">
            <Navbar />
            <div className="add-lesson__main-content">

            </div>
        </div>
    );

}

export default AddLesson;