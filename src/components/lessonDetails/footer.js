import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//components
import ConfirmDialog from './confirmDialog';

//styles
import "../../styles/lessonDetails/footer.css"

function Footer({ selectedSection, sections, onSectionSelect }) {
    const { id, lessonId } = useParams();
    const navigate = useNavigate();
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showTestConfirm, setShowTestConfirm] = useState(false);

    const handlePrevious = () => {
        if (!selectedSection || !sections) return;

        const currentIndex = sections.findIndex(s => s.id === selectedSection.id);
        if (currentIndex > 0) {
            // Chuyển đến phần học trước
            const previousSection = sections[currentIndex - 1];
            onSectionSelect(previousSection);
        } else {
            // Nếu đang ở phần học đầu tiên, hiển thị xác nhận thoát
            setShowExitConfirm(true);
        }
    };

    const handleNext = () => {
        if (!selectedSection || !sections) return;

        const currentIndex = sections.findIndex(s => s.id === selectedSection.id);
        if (currentIndex < sections.length - 1) {
            // Chuyển đến phần học tiếp theo
            const nextSection = sections[currentIndex + 1];
            onSectionSelect(nextSection);
        } else {
            // Nếu đang ở phần học cuối cùng, hiển thị xác nhận làm bài kiểm tra
            setShowTestConfirm(true);
        }
    };

    const handleExitConfirm = (confirmed) => {
        setShowExitConfirm(false);
        if (confirmed) {
            // Quay lại trang courseDetails
            navigate(`/courses/${id}`);
        }
    };

    const handleTestConfirm = (confirmed) => {
        setShowTestConfirm(false);
        if (confirmed) {
            // Điều hướng đến trang làm bài kiểm tra
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
