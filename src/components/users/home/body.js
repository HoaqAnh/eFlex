import React, { useEffect, useRef } from "react";
import useDraggableScroll from "../../../hooks/ui/useDraggaableScroll";
import Course from "./course";
import "../../../styles/users/home/body.css";

const Body = () => {
    const containerRef = useDraggableScroll();

    return (
        <div className="home-body">
            <div className="home-body__container">
                <p className="home-body__container-title">
                    Khóa học bạn đã tham gia
                </p>
                <div className="home-body__container-main" ref={containerRef}>
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