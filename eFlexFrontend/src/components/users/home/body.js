import Loading from "../../../components/layout/loader/loading"
import CourseStudying from "./courseStudying";
import "../../../styles/users/home/body.css";
import { useGetCourseStudying } from "../../../hooks/progress/useProgress";

const Body = ({ UserData }) => {
    const { loading, error, courseStudying } = useGetCourseStudying(UserData.id);

    if (loading) {
        return <div className="home-body"><Loading Title="Dữ liệu bài học của bạn đang được tải..." /></div>
    }

    if (error) {
        return (
            <div className="home-body">
                <div className="home-body__container">
                    <p className="home-body__container-title">
                        Khóa học bạn đã tham gia
                    </p>
                    <div className="home-body__container-main">
                        <p className="getCourseStudyingError">Không thể tải dữ liệu bài học của bạn!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-body">
            <div className="home-body__container">
                <p className="home-body__container-title">
                    Khóa học bạn đã tham gia
                </p>
                <div className="home-body__container-main">
                    <CourseStudying
                        courseStudying={courseStudying}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}

export default Body; 