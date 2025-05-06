import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//services
import { getCourseLessons } from "../../services/lessonService";
import { getCourseDetails } from "../../services/courseService";

//components
import LessonWithSection from "./lessonWithSection";

//styles
import "../../styles/courseDetails/body.css";

const Body = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseData, lessonsData] = await Promise.all([
                    getCourseDetails(id),
                    getCourseLessons(id)
                ]);
                setCourse(courseData);
                // Sắp xếp bài học theo viTri
                const sortedLessons = [...lessonsData].sort((a, b) => a.viTri - b.viTri);
                setLessons(sortedLessons);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="course-details__body">Đang tải...</div>;
    }

    if (error) {
        return <div className="course-details__body">Có lỗi xảy ra: {error}</div>;
    }

    return (
        <div className="course-details__body">
            <div className="course-details__body-header">
                <div className="course-details__body-header-action">
                    <h4>Tiếp tục khóa học</h4>
                    <button className="btn btn-section-secondary">Học tiếp</button>
                </div>
            </div>
            <div className="course-details__body-content">
                <div className="course-details__body-content-left">
                    {lessons.map((lesson) => (
                        <LessonWithSection key={lesson.id} lesson={lesson} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Body;