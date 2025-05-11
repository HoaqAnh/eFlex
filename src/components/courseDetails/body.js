import React from "react";
import LessonWithSection from "./lessonWithSection";
import "../../styles/courseDetails/body.css"

const Body = ({ courseDetail, lessonDetail, lessonLoading, lessonError }) => {

    if (lessonLoading) {
        return <div className="course-details__body">Đang tải...</div>;
    }

    if (lessonError) {
        return <div className="course-details__body">Có lỗi xảy ra, vui lòng truy cập lại sau.</div>;
    }

    return (
        <div className="course-details__body">
            {lessonDetail.map((lessonDetail) => (
                <LessonWithSection key={lessonDetail.id} lesson={lessonDetail} course={courseDetail} />
            ))}
        </div>
    );
}

export default Body;