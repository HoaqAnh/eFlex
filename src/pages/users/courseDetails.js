import React from "react";
import { useParams } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import Header from "../../components/courseDetails/header"
import Body from "../../components/courseDetails/body"
import Footer from "../../components/courseDetails/footer"

//hooks
import { useAuth } from "../../hooks/useAuth";
import useCourseStudyTimer from "../../hooks/courses/useCourseStudyTimer"

//style
import "../../styles/courseDetails/style.css"
import "../../styles/layout/header.css"

const CourseDetails = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    const { id } = useParams();

    const handleExit = (totalTimeInSeconds) => {
        if (totalTimeInSeconds > 0) {
            console.log(totalTimeInSeconds);
        }
    };

    const { currentTimeInSeconds } = useCourseStudyTimer(handleExit, id);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="course-details">
            <Navbar />
            <div className="course-details__main-content">
                <div className="course-details__content-wrapper">
                    <p>Thời gian hiện tại: {currentTimeInSeconds}</p>
                    <Header />
                    <Body />
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;