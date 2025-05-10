import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/courseDetails/header"
import Body from "../../../components/courseDetails/body"
import Footer from "../../../components/courseDetails/footer"
import { useAuth } from "../../../hooks/useAuth";
import { userStudyData } from "../../../services/modelService"
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer"
import useCourse from "../../../hooks/course/useCourse"
import "../../../styles/courseDetails/style.css"

const CourseDetails = () => {
    const { id: courseId } = useParams();
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    const { courseDetail, loading, error} = useCourse(courseId);

    const handleExit = (totalTimeInSeconds) => {
        if (totalTimeInSeconds > 0) {
            userStudyData(courseId, totalTimeInSeconds);
        }
    };
    useCourseStudyTimer(handleExit, courseId);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="course-details">
            <Header
                courseId={courseId}
                courseDetail={courseDetail}
                courseLoading={loading}
                courseError={error}
            />
            <Body />
            <Footer />
        </div>
    );
}

export default CourseDetails;