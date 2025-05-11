import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSections } from "../../hooks/course/useSection";
import "../../styles/courseDetails/lessonWithSection.css"

const LessonWithSection = ({ lesson, course }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { listSection, loading: sectionLoading, error: sectionError } = useSections(lesson.id);

    const handleLessonDetails = () => {
        if (course?.id && lesson?.id) {
            navigate(`/course/${course.id}/lesson/${lesson.id}`);
        }
    };

    const handleExercises = () => {
        if (course?.id && lesson?.id) {
            navigate(`/course/${course.id}/lesson/${lesson.id}/test`);
        }
    };

    if (sectionLoading) {
        return <div className="lesson-details__sidebar">Đang tải...</div>;
    }

    if (sectionError) {
        return <div className="lesson-details__sidebar">Có lỗi xảy ra</div>;
    }

    return (
        <div className="eflex-playlist__lesson">
            <div className={`lesson-body__content ${collapsed ? 'collapsed' : ''}`}>
                <div className="lesson-body__content-top" onClick={() => setCollapsed(!collapsed)}>
                    <h3>{lesson?.tenBai}</h3>
                    <div className="expand-button"></div>
                </div>
                <div className="lesson-body__content-content">
                    {listSection.map((section) => (
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