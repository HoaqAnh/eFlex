import React from "react";
import RecommendItem from "./recommendItem";
import useDraggableScroll from "../../../hooks/ui/useDraggaableScroll";
import "../../../styles/users/home/recommend.css";

const Recommend = ({ recommendData, loading, error }) => {
    const containerRef = useDraggableScroll();

    const renderContent = () => {
        if (loading) return <p>Đang tải dữ liệu...</p>;
        if (error) return <p>Có lỗi xảy ra: {error}</p>;
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