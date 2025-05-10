import React, { useEffect, useState } from "react";
import { useLesson } from "../../../hooks/course/useLesson";
import { useCourse } from "../../../hooks/course/useCourse";
import "../../../styles/users/course/item.css";

const Item = ({ course, isSelectingCourse, isSelected, onSelectCourse, animationDelay = 0 }) => {
    const { handleJoinCourse } = useCourse();
    const { loading, error, fetchCountData } = useLesson();
    const [count, setCount] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const getCountData = async () => {
            const data = await fetchCountData(course.id);
            if (data) {
                setCount(data);
            }
        };

        getCountData();
    }, [fetchCountData, course.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, animationDelay);
        
        return () => clearTimeout(timer);
    }, [animationDelay]);

    if (loading) {
        return <div className="course-item loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="course-item error">Lỗi: {error}</div>;
    }

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
                <p>{count?.baiHoc || "0"} bài học - {count?.baiTap || "0"} bài tập</p>
            </div>
        </div>
    );
}

export default Item;