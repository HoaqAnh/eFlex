import React from 'react';

//styles
import '../../styles/lessonDetails/confirmDialog.css';

const ConfirmDialog = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = "Đồng ý",
    cancelText = "Hủy"
}) => {
    if (!isOpen) return null;

    return (
        <div className="lesson-details__popup-overlay">
            <div className="lesson-details__popup">
                <div className="lesson-details__popup-header">
                    <h3>{title}</h3>
                </div>
                <div className="lesson-details__popup-body">
                    <p>{message}</p>
                </div>
                <div className="lesson-details__popup-footer">
                    <button 
                        className="btn btn-section-secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className="btn btn-section-primary"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog; 