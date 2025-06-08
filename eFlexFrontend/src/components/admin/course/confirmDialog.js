import React from "react";

import "../../../styles/admin/course/confirmDialog.css";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <div className="confirm-dialog-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirm-dialog-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-dialog-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={onConfirm}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog; 
