import React from "react";

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

const CourseDetails = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
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