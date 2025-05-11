import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmDialog from './confirmDialog';
import { useProgress } from '../../hooks/progress/useProgress';
import { getCourseLessons, getLessonSections } from "../../services/lessonService";
import "../../styles/lessonDetails/sidebar.css"

const Sidebar = ({ onSectionSelect, selectedSectionId }) => {
    const navigate = useNavigate();
    const { id, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showTestConfirm, setShowTestConfirm] = useState(false);
    const { sendSectionProgress } = useProgress();

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

                // Chọn section đầu tiên nếu có dữ liệu và chưa có section nào được chọn
                if (sortedSections.length > 0 && !selectedSectionId) {
                    onSectionSelect(sortedSections[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, lessonId, onSectionSelect, selectedSectionId]);

    const handleSectionClick = (section) => {
        if (selectedSectionId) {
            sendSectionProgress(selectedSectionId);
        }

        onSectionSelect(section);
    };

    const handlePrevious = () => {
        if (!selectedSectionId || !sections?.length) return;

        const currentIndex = sections.findIndex(s => s.id === selectedSectionId);
        if (currentIndex > 0) {
            const previousSection = sections[currentIndex - 1];
            onSectionSelect(previousSection);
        } else {
            setShowExitConfirm(true);
        }
    };

    const handleNext = () => {
        if (!selectedSectionId || !sections?.length) return;

        const currentIndex = sections.findIndex(s => s.id === selectedSectionId);
        const selectedSection = sections.find(s => s.id === selectedSectionId);

        // Gửi tiến trình cho section hiện tại
        if (selectedSection) {
            sendSectionProgress(selectedSection.id);
        }

        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            onSectionSelect(nextSection);
        } else {
            setShowTestConfirm(true);
        }
    };

    const handleExitConfirm = (confirmed) => {
        setShowExitConfirm(false);
        if (confirmed) {
            navigate(`/course/${id}`);
        }
    };

    const handleTestConfirm = (confirmed) => {
        setShowTestConfirm(false);
        if (confirmed) {
            navigate(`/course/${id}/lesson/${lessonId}/test`);
        }
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
                            className={`lesson-details__sidebar-content-body-item ${selectedSectionId === section.id ? "active" : ""}`}
                            key={section.id}
                            onClick={() => handleSectionClick(section)}
                        >
                            <p>{section.tenBai}</p>
                        </div>
                    ))}
                </div>
                <div className="lesson-details__sidebar-content-footer">
                    <div className="lesson-details__sidebar-action-buttons">
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevious}
                        >
                            Quay lại
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showExitConfirm}
                title="Xác nhận thoát"
                message="Bạn có chắc chắn muốn thoát khỏi bài học này?"
                onConfirm={() => handleExitConfirm(true)}
                onCancel={() => handleExitConfirm(false)}
            />

            <ConfirmDialog
                isOpen={showTestConfirm}
                title="Xác nhận làm bài kiểm tra"
                message="Bạn có muốn làm bài kiểm tra để chuyển sang bài học tiếp theo không?"
                onConfirm={() => handleTestConfirm(true)}
                onCancel={() => handleTestConfirm(false)}
            />
        </div>
    );
}

export default Sidebar;