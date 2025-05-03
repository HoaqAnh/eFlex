import React from "react";

//style
import "../../../styles/users/home/recommendItem.css"

const RecommendItem = () => {
    const courseImage = "./courseImage";
    const courseName = "Môn học ABC";
    return (
        <div className="home-RecommendItem">
            <div className="home-RecommendItem__container">
                <img src={courseImage} alt="course" loading="lazy"/>
                <p>{courseName}</p>
            </div>
        </div>
    );
}

export default RecommendItem;