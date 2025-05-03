import React from "react";

//component
import Lesson from "./lesson"

//style
import "../../../styles/users/home/course.css"

const Course = () => {
    const courseImage = "./courseImage";
    const courseName = "Môn học ABC";
    return (
        <div className="home-course">
            <div className="home-course__container">
                <div className="home-course__container-left">
                    <img src={courseImage} alt="course" loading="lazy" />
                    <p>{courseName}</p>
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