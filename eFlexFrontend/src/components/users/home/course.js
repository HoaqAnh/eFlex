import Lesson from "./lesson"
import "../../../styles/users/home/course.css"
import { useNavigate } from "react-router-dom"

const Course = ({ CourseData }) => {
    const navigator = useNavigate();
    return (
        <div className="home-course">
            <div className="home-course__container">
                <div className="home-course__container-left" onClick={() => { navigator(`/course/${CourseData.id}`) }}>
                    <img src={CourseData.image} alt="course" loading="lazy" />
                    <p className="home-course__name">{CourseData.name}</p>
                </div>
                <div className="home-course__divider-vertical" />
                <div className="home-course__container-right">
                    {CourseData.lessonList.length > 0 ? (
                        CourseData.lessonList.map((lesson) => (
                            <Lesson
                                key={lesson.id}
                                LessonName={lesson.name}
                                Complete={lesson.complete}
                            />
                        ))
                    ) : (
                        <p>Không có bài học nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Course;