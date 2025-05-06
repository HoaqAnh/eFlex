import React from "react";
import { useNavigate } from "react-router-dom";

//style
import "../../../styles/users/home/recommendItem.css"

const RecommendItem = ({ course }) => {
    const navigate = useNavigate();

    const handleCourseClick = () => {
        navigate(`/courses/${course.monhoc_id}`);
    };

    return (
        <div className="home-RecommendItem" onClick={handleCourseClick}>
            <div className="home-RecommendItem__container">
                <img 
                    src={course.anh_mon_hoc || "./courseImage"} 
                    alt={course.ten_mon} 
                    loading="lazy"
                />
                <p>{course.ten_mon}</p>
            </div>
        </div>
    );
}

export default RecommendItem;