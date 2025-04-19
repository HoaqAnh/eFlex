import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import Header from "../../components/courseDetails/header"
import Body from "../../components/courseDetails/body"
import Footer from "../../components/courseDetails/footer"

//hooks
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/courseDetails/style.css"
import "../../styles/layout/header.css"

function CourseDetails() {
    const { isAuthenticated, isLoading, error } = useAuth();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div className="course-details">
            <Navbar />
            <div className="course-details__main-content">
                <div className="course-details__content-wrapper">
                    <Header />
                    <Body />
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;