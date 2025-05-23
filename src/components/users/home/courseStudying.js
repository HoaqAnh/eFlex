import Course from "./course";
import useDraggableScroll from "../../../hooks/ui/useDraggaableScroll";
import "../../../styles/users/home/courseStudying.css";

const CourseStudying = ({ courseStudying, loading, error }) => {
    const containerRef = useDraggableScroll();
    const renderContent = () => {
        if (loading) return <p>Đang tải dữ liệu...</p>;
        if (error) return <p>Có lỗi xảy ra: {error}</p>;
        if (!courseStudying?.length) return <p>Chưa có khóa học đề xuất</p>;

        return courseStudying.map((course, index) => (
            <Course key={index} CourseData={course} />
        ));
    };

    return (
        <div className="home-courseStudying" ref={containerRef}>
            {renderContent()}
        </div>
    );
};

export default CourseStudying;