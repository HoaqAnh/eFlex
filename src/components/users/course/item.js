import React, { useEffect, useState } from "react";
import useLesson from "../../../hooks/course/useLesson";
import useCourse from "../../../hooks/course/useCourse";
import "../../../styles/users/course/item.css";

const Item = ({ course, isSelectingCourse, isSelected, onSelectCourse, animationDelay = 0 }) => {
    const { handleJoinCourse } = useCourse(course.id);
    const { countLessonAndTest } = useLesson(course.id);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, animationDelay);

        return () => clearTimeout(timer);
    }, [animationDelay]);

    const handleItemClick = () => {
        if (isSelectingCourse) {
            onSelectCourse(course.id);
        } else if (!isSelectingCourse && !isSelected) {
            handleJoinCourse(course.id);
        }
    };

    const itemStyle = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.5s ease-out ${animationDelay}ms, transform 0.5s ease-out ${animationDelay}ms`
    };

    return (
        <div
            className={`course-item ${isSelectingCourse ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={handleItemClick}
            style={itemStyle}
        >
            <div className="course-item__thumbnail">
                <img
                    src={course?.anhMonHoc || "./courseImage"}
                    alt={course?.tenMon || "course"}
                    className="course-thumbnail"
                />
            </div>
            <div className="course-item__info">
                <h4>{course?.tenMon || "loading..."}</h4>
                <p>{course?.category?.nameCategory || "loading..."}</p>
                <p>{countLessonAndTest?.baiHoc || "0"} bài học - {countLessonAndTest?.baiTap || "0"} bài tập</p>
            </div>
        </div>
    );
}

export default Item;