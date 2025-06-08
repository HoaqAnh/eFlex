import React from "react";
import RecommendItem from "./recommendItem";
import useDraggableScroll from "../../../hooks/ui/useDraggaableScroll";
import Loading from "../../layout/loader/loading"
import Error from "../../layout/loader/error"
import "../../../styles/users/home/recommend.css";

const Recommend = ({ recommendData, loading, error }) => {
    const containerRef = useDraggableScroll();

    const renderContent = () => {
        if (loading) return <Loading />;
        if (error) return <Error />;
        if (!recommendData?.recommendations?.length) return <p className="NoContentRecommend">Chưa có khóa học đề xuất nào cho bạn</p>;

        return recommendData.recommendations.map((course, index) => (
            <RecommendItem key={index} course={course} />
        ));
    };

    return (
        <div className="home-recommend">
            <p className="home-recommend__title">Một số khóa học có thể phù hợp với bạn</p>
            <div className="home-recommend__container" ref={containerRef}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Recommend;