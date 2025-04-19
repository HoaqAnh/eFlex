import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//services
import { getCourseLessons, getLessonSections } from "../../services/lessonService";

//styles
import "../../styles/lessonDetails/sidebar.css"

function Sidebar({ onSectionSelect }) {
    const { id, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lessonData = await getCourseLessons(id);
                // Tìm bài học có id trùng với lessonId
                const currentLesson = lessonData.find(lesson => lesson.id === parseInt(lessonId));
                setLesson(currentLesson);

                const sectionsData = await getLessonSections(lessonId);
                const sortedSections = [...sectionsData].sort((a, b) => a.viTri - b.viTri);
                setSections(sortedSections);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, lessonId]);

    const handleSectionClick = (section) => {
        onSectionSelect(section);
    };

    if (loading) {
        return <div className="lesson-details__sidebar">Đang tải...</div>;
    }

    if (error) {
        return <div className="lesson-details__sidebar">Có lỗi xảy ra: {error}</div>;
    }

    return (
        <div className="lesson-details__sidebar">
            <div className="lesson-details__sidebar-content">
                <div className="lesson-details__sidebar-content-header">
                    <h2>{lesson?.tenBai}</h2>
                </div>
                <div className="lesson-details__sidebar-content-body">
                    {sections.map((section) => (
                        <div 
                            className="lesson-details__sidebar-content-body-item" 
                            key={section.id}
                            onClick={() => handleSectionClick(section)}
                        >
                            <button className="btn btn-section-secondary">
                                <p>{section.tenBai}</p>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="lesson-details__sidebar-content-footer">
                    <button className="btn btn-section-primary">Làm bài kiểm tra</button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
