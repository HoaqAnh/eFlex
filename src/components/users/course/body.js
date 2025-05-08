import React, { useEffect, useState } from "react";
import Item from "./item";
import { useCourse } from "../../../hooks/course/useCourse";
import "../../../styles/users/course/body.css";

const Body = () => {
    const { loading, error, fetchCourse } = useCourse();
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
        const getCourses = async () => {
            const data = await fetchCourse();
            if (data) {
                setCourseData(data);
            }
        };

        getCourses();
    }, [fetchCourse]);

    if (loading) {
        return <div className="course-body__container">Đang tải khóa học...</div>;
    }

    if (error) {
        return <div className="course-body__container">Lỗi khi tải khóa học: {error}</div>;
    }

    if (!courseData || !Array.isArray(courseData) || courseData.length === 0) {
        return <div className="course-body__container">Không có khóa học nào.</div>;
    }
    return (
        <div className="course-body">
            <div className="course-body__container">
                {courseData && courseData.map((courseItem) => (
                    <Item key={courseItem.id} course={courseItem} />
                ))}
            </div>
        </div>
    );
};

export default Body;