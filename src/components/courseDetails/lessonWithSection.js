import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//services
import { getLessonSections } from "../../services/lessonService";

//styles
import "../../styles/courseDetails/lessonWithSection.css"

function LessonWithSection({ lesson, course }) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const sectionsData = await getLessonSections(lesson.id);
                // Sắp xếp phần học theo viTri
                const sortedSections = [...sectionsData].sort((a, b) => a.viTri - b.viTri);
                setSections(sortedSections);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (lesson?.id) {
            fetchSections();
        }
    }, [lesson?.id]);

    if (loading) {
        return <div className="lesson-body__content">Đang tải...</div>;
    }

    if (error) {
        return <div className="lesson-body__content">Có lỗi xảy ra: {error}</div>;
    }

    const handleLessonDetails = () => {
        if (course?.id && lesson?.id) {
            navigate(`/courses/${course.id}/lesson/${lesson.id}`);
        }
    };

    const handleExercises = () => {
        if (course?.id && lesson?.id) {
            navigate(`/courses/${course.id}/lesson/${lesson.id}/test`);
        }
    };

    return (
        <div className="eflex-playlist__lesson">
            <div className={`lesson-body__content ${collapsed ? 'collapsed' : ''}`}>
                <div className="lesson-body__content-top" onClick={() => setCollapsed(!collapsed)}>
                    <h3>{lesson?.tenBai}</h3>
                    <div className="expand-button"></div>
                </div>
                <div className="lesson-body__content-content">
                    {sections.map((section) => (
                        <h4 key={section.id}>{section.tenBai}</h4>
                    ))}
                </div>
                <div className="lesson-body__content-actions">
                    <button className="btn btn-section-primary" onClick={handleLessonDetails}>Bắt đầu học</button>
                    <button className="btn btn-section-secondary" onClick={handleExercises}>Làm bài tập</button>
                </div>
            </div>
        </div>
    );
}

export default LessonWithSection;

