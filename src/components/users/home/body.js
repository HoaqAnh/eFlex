import React from "react";

//component
import Course from "./course"

//style
import "../../../styles/users/home/body.css"

const Body = () => {
    return (
        <div className="home-body">
            <div className="home-body__container">
                <p className="home-body__container-title">
                    Khóa học bạn đã tham gia
                </p>
                <div className="home-body__container-main">
                    <Course />
                    <Course />
                    <Course />
                    <Course />
                </div>
            </div>
        </div>
    );
}

export default Body;