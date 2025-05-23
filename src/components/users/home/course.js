import Lesson from "./lesson"
import "../../../styles/users/home/course.css"

const Course = ({ CourseData }) => {
    const courseInfo = {
        id: CourseData.id,
        image: CourseData.anhMonHoc,
        name: CourseData.tenMon
    }
    // => Gọi api http://localhost:8080/api/v1/{lessonId}/Listsection lấy danh sách list section.
    return (
        <div className="home-course">
            <div className="home-course__container">
                <div className="home-course__container-left">
                    <img src={courseInfo.image} alt="course" loading="lazy" />
                    <p className="home-course__name">{courseInfo.name}</p>
                </div>
                <div className="home-course__divider-vertical" />
                <div className="home-course__container-right">
                    <Lesson />
                    <Lesson />
                    <Lesson />
                    <Lesson />
                </div>
            </div>
        </div>
    );
}

export default Course;