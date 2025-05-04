import React from "react";

//component
import RecommendItem from "./recommendItem"

//style
import "../../../styles/users/home/recommend.css"

const Recommend = () => {
    return (
        <div className="home-recommend">
            <p className="home-recommend__title">Môn học đề xuất cho bạn</p>
            <div className="home-recommend__container">
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
                <RecommendItem />
            </div>
        </div>
    );
}

export default Recommend;