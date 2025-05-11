import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/courseDetails/header"
import Body from "../../../components/courseDetails/body"
import Footer from "../../../components/courseDetails/footer"
import { useAuth } from "../../../hooks/useAuth";
import { userStudyData } from "../../../services/modelService"
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer"
import { useCourseDetail } from "../../../hooks/course/useCourse"
import { useLessonDetail, useCountLessonAndTest } from "../../../hooks/course/useLesson";
import "../../../styles/courseDetails/style.css"

const CourseDetails = () => {
    const { id: courseId } = useParams();
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    const { courseDetail, loading: courseLoading, error: courseError } = useCourseDetail(courseId);
    const { listLesson, loading: lessonLoading, error: lessonError} = useLessonDetail(courseId);
    const { countLessonAndTest, loading: countLoading, error: countError} = useCountLessonAndTest(courseId);

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
                courseDetail={courseDetail}
                countLessonAndTest={countLessonAndTest}
                courseLoading={courseLoading}
                courseError={courseError}
                lessonLoading={Boolean(lessonLoading || countLoading)}
                lessonError={Boolean(lessonError || countError)}
            />
            <Body
                courseDetail={courseDetail}
                lessonDetail={listLesson}
                lessonLoading={lessonLoading}
                lessonError={lessonError}
            />
            <Footer />
        </div>
    );
}

export default CourseDetails;