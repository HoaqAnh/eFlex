import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseLessons } from "../../services/lessonService";
import { getCourseDetails } from "../../services/courseService";
import useCourse from "../../hooks/course/useCourse";
import useLesson from "../../hooks/course/useLesson";
import LessonWithSection from "./lessonWithSection";
import "../../styles/courseDetails/body.css"

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
            {lessons.map((lesson) => (
                <LessonWithSection key={lesson.id} lesson={lesson} course={course} />
            ))}
        </div>
    );
}

export default Body;