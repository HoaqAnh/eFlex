import React from "react";
import LessonWithSection from "./lessonWithSection";
import "../../styles/courseDetails/body.css"

const Body = ({ courseDetail, lessonDetail }) => (
    <div className="course-details__body">
        {lessonDetail.map((lessonDetail) => (
            <LessonWithSection key={lessonDetail.id}
                lesson={lessonDetail}
                course={courseDetail}
            />
        ))}
    </div>
);

export default Body;