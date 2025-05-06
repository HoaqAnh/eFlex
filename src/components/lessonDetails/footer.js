import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//components
import ConfirmDialog from './confirmDialog';

//hook
import { useProgress } from '../../hooks/progress/useProgress';

//styles
import "../../styles/lessonDetails/footer.css";

const Footer = ({ selectedSection, sections, onSectionSelect }) => {
    const { id, lessonId } = useParams();
    const navigate = useNavigate();
    const { sendSectionProgress } = useProgress();
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showTestConfirm, setShowTestConfirm] = useState(false);

    const handlePrevious = () => {
        if (!selectedSection || !sections) return;

        const currentIndex = sections.findIndex(s => s.id === selectedSection.id);
        if (currentIndex > 0) {
            const previousSection = sections[currentIndex - 1];
            onSectionSelect(previousSection);
        } else {
            setShowExitConfirm(true);
        }
    };

    const handleNext = () => {
        if (!selectedSection || !sections) return;
        const currentIndex = sections.findIndex(s => s.id === selectedSection.id);
        const sectionId = sections[currentIndex];
        sendSectionProgress(sectionId.id);

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
            navigate(`/courses/${id}`);
        }
    };

    const handleTestConfirm = (confirmed) => {
        setShowTestConfirm(false);
        if (confirmed) {
            navigate(`/courses/${id}/lesson/${lessonId}/test`);
        }
    };

    return (
        <div className="lesson-details__footer">
            <div className="lesson-details__footer-content">
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

export default Footer;
