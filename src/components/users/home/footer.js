import React from "react";

//component
import RecommendItem from "./recommendItem"

//style
import "../../../styles/users/home/footer.css"

const Footer = () => {
    return (
        <div className="home-footer">
            <h3>Môn học đề xuất cho bạn</h3>
            <div className="home-footer__container">
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

export default Footer;