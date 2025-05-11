import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/courseDetails/header"
import Body from "../../../components/courseDetails/body"
import Footer from "../../../components/courseDetails/footer"
import Loading from "../../../components/layout/loader/loading"
import { useAuth } from "../../../hooks/useAuth";
import { userStudyData } from "../../../services/modelService"
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer"
import { useCourseDetail } from "../../../hooks/course/useCourse"
import { useLessons, useCountLessonAndTest } from "../../../hooks/course/useLesson";
import "../../../styles/courseDetails/style.css"

const CourseDetails = () => {
    const { id: courseId } = useParams();
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    const { courseDetail, loading: courseLoading, error: courseError } = useCourseDetail(courseId);
    const { listLesson, loading: lessonLoading, error: lessonError } = useLessons(courseId);
    const { countLessonAndTest, loading: countLoading, error: countError } = useCountLessonAndTest(courseId);

    const handleExit = (totalTimeInSeconds) => {
        if (totalTimeInSeconds > 0) {
            userStudyData(courseId, totalTimeInSeconds);
        }
    };
    useCourseStudyTimer(handleExit, courseId);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    const loading = courseLoading || lessonLoading || countLoading;
    const error = courseError || lessonError || countError;

    return (
        <div className="course-details">
            {error && <div className='error-message'>Có lỗi xảy ra vui lòng thử lại sau.</div>}
            {loading ? (
                <Loading Title="Đang tải nội dung khoá học..." />
            ) : (
                <>
                    <Header
                        courseDetail={courseDetail}
                        countLessonAndTest={countLessonAndTest}
                    />
                    <Body
                        courseDetail={courseDetail}
                        lessonDetail={listLesson}
                    />
                    <Footer />
                </>
            )}
        </div>
    );
}

export default CourseDetails;