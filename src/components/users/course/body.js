import React, { useEffect, useState } from "react";
import Item from "./item";
import { useCourse } from "../../../hooks/admin/useCourse";
import "../../../styles/users/course/body.css";

const Body = ({ isSelectingCourse, selectedCourseId, onSelectCourse, hideUnselected }) => {
    const { courseData, loading, error } = useCourse();
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        if (courseData && selectedCourseId) {
            const course = courseData.find(item => item.id === selectedCourseId);
            setSelectedCourse(course);
        } else {
            setSelectedCourse(null);
        }
    }, [selectedCourseId, courseData]);

    if (loading) {
        return <div className="course-body__container">Đang tải khóa học...</div>;
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
                {displayCourses.map((courseItem) => (
                    <Item
                        key={courseItem.id}
                        course={courseItem}
                        isSelectingCourse={isSelectingCourse}
                        isSelected={selectedCourseId === courseItem.id}
                        onSelectCourse={onSelectCourse}
                    />
                ))}
            </div>
        </div>
    );
};

export default Body;