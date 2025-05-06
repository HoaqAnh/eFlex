import React from "react";

//component
import Lesson from "./lesson"

//style
import "../../../styles/users/home/course.css"

const Course = () => {
    const courseInfo = {
        image: "./courseImage",
        name: "Xác suất thống kê",
        lesson: 4,
        test: 12
    }

    return (
        <div className="home-course">
            <div className="home-course__container">
                <div className="home-course__container-left">
                    <img src={courseInfo.courseImage} alt="course" loading="lazy" />
                    <p className="home-course__name">{courseInfo.name}</p>
                    {/* <p className="home-course__lesson">Tổng số bài học: {courseInfo.lesson}</p>
                    <p className="home-course__test">Tổng số bài tập: {courseInfo.test}</p> */}
                </div>
                <div className="home-course__divider-vertical" />
                <div className="home-course__container-right">
                    <Lesson />
                    <Lesson />
                    <Lesson />
                    <Lesson />
                </div>
            </div>
        </div>
    );
}

export default Course;