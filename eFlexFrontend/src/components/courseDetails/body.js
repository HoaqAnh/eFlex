import React from "react";
import LessonWithSection from "./lessonWithSection";
import "../../styles/courseDetails/body.css";

const Body = ({ user, courseDetail, lessons }) => (
    <div className="course-details__body">
        <h4 className="course-details__body-title">◿ Danh sách các bài học</h4>
        {Array.isArray(lessons) && lessons.length > 0 ? (
            lessons.map((lessonItem) => (
                <LessonWithSection
                    key={lessonItem.id}
                    user={user}
                    lesson={lessonItem}
                    course={courseDetail}
                />
            ))
        ) : (
            <p>Khóa học này hiện chưa có bài học nào.</p>
        )}
    </div>
);

export default Body;