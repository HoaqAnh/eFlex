import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import Header from "../../components/exercises/header";
import Body from "../../components/exercises/body";
import Footer from "../../components/exercises/footer";

//hooks
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/exercises/style.css"

function Exercises() {
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
        <div className="exercises">
            <Navbar />
            <div className="exercises__main-content">
                <Header />
                <div className="exercises__content-wrapper">
                    <Body />
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Exercises;