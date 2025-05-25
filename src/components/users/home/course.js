import Lesson from "./lesson"
import "../../../styles/users/home/course.css"

const Course = ({ CourseData }) => {
    return (
        <div className="home-course">
            <div className="home-course__container">
                <div className="home-course__container-left">
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
                        <p>Không có bài kiểm tra nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Course;