import React, { useEffect, useState } from "react";
import Item from "./item";
import SkeletonItem from "./skeletonItem";
import { useCourse } from "../../../hooks/admin/useCourse";
import "../../../styles/users/course/body.css";

const Body = ({ isSelectingCourse, selectedCourseId, onSelectCourse, hideUnselected }) => {
    const { courseData, loading, error } = useCourse();
    // const [selectedCourse, setSelectedCourse] = useState(null);
    const [loadingAnimation, setLoadingAnimation] = useState(true);
    const [prevCourseCount, setPrevCourseCount] = useState(2);

    // useEffect(() => {
    //     if (courseData && selectedCourseId) {
    //         const course = courseData.find(item => item.id === selectedCourseId);
    //         setSelectedCourse(course);
    //     } else {
    //         setSelectedCourse(null);
    //     }
    // }, [selectedCourseId, courseData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingAnimation(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [courseData]);

    useEffect(() => {
        if (courseData && Array.isArray(courseData) && courseData.length > 0) {
            setPrevCourseCount(courseData.length);
        }
    }, [courseData]);

    if (loading || loadingAnimation) {
        return (
            <div className="course-body">
                <div className="course-body__container">
                    {Array.from({ length: prevCourseCount }).map((_, index) => (
                        <SkeletonItem key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="course-body__container">Lỗi khi tải khóa học: {error}</div>;
    }

    if (!courseData || !Array.isArray(courseData) || courseData.length === 0) {
        return <div className="course-body__container">Không có khóa học nào.</div>;
    }

    const displayCourses = hideUnselected && selectedCourseId
        ? courseData.filter(courseData => courseData.id === selectedCourseId)
        : courseData;

    return (
        <div className="course-body">
            {isSelectingCourse && (
                <div className="course-selection-mode">
                    <p>Chọn một khóa học để bắt đầu</p>
                </div>
            )}

            <div className="course-body__container">
                {displayCourses.map((courseItem, index) => (
                    <Item
                        key={courseItem.id}
                        course={courseItem}
                        isSelectingCourse={isSelectingCourse}
                        isSelected={selectedCourseId === courseItem.id}
                        onSelectCourse={onSelectCourse}
                        animationDelay={index * 25}
                    />
                ))}
            </div>
        </div>
    );
};

export default Body;