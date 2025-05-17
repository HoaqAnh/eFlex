import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/courseDetails/header";
import Body from "../../../components/courseDetails/body";
import Footer from "../../../components/courseDetails/footer";
import Loading from "../../../components/layout/loader/loading";
import Error from "../../../components/layout/loader/error";
import { useAuth } from "../../../hooks/useAuth";
import { userStudyData } from "../../../services/modelService";
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer";
import { useCourseDetail } from "../../../hooks/course/useCourse";
import { useLessons, useCountLessonAndTest } from "../../../hooks/course/useLesson";
import "../../../styles/courseDetails/style.css";

const CourseDetails = () => {
    const { id: courseId } = useParams();
    const { checkAuth, user } = useAuth();
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

    const pageLoading = courseLoading || lessonLoading || countLoading;
    const pageError = courseError || lessonError || countError;

    if (pageError) {
        let errorMessage = "Bài học đã chạy mất! Vui lòng quay lại sau ít phút nữa.";
        if (courseError) errorMessage = "Lỗi tải thông tin khóa học.";
        else if (lessonError) errorMessage = "Lỗi tải danh sách bài học.";
        else if (countError) errorMessage = "Lỗi tải thông tin số lượng bài học và bài kiểm tra.";
        return <Error Title={errorMessage} />;
    }

    return (
        <div className="course-details">
            {pageLoading ? (
                <Loading Title="Đang tải nội dung khoá học..." />
            ) : (
                <>
                    <div className="course-details__container">
                        <Header
                            courseDetail={courseDetail}
                            countLessonAndTest={countLessonAndTest}
                        />
                        <Body
                            user={user}
                            courseDetail={courseDetail}
                            lessons={listLesson}
                        />
                    </div>
                    <Footer />
                </>
            )}
        </div>
    );
};

export default CourseDetails;