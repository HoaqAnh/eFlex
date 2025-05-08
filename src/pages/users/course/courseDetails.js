import React from "react";
import { useParams } from "react-router-dom";

//components
import Header from "../../../components/courseDetails/header"
import Body from "../../../components/courseDetails/body"
import Footer from "../../../components/courseDetails/footer"

//hooks
import { useAuth } from "../../../hooks/useAuth";
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer"

//service
import { userStudyData } from "../../../services/modelService"
//style
import "../../../styles/courseDetails/style.css"

const CourseDetails = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    const { id } = useParams();

    const handleExit = (totalTimeInSeconds) => {
        if (totalTimeInSeconds > 0) {
            userStudyData(id, totalTimeInSeconds);
        }
    };
    useCourseStudyTimer(handleExit, id);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="course-details">
            <Header />
            <Body />
            <Footer />
        </div>
    );
}

export default CourseDetails;