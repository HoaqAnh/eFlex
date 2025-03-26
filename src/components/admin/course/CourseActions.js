import React from 'react';

const CourseActions = ({ handleBack, handleSubmit }) => {
    return (
        <div className="add-course__actions">
            <button className="btn btn-primary" onClick={handleBack}>
                Trở về
            </button>
            <button className="btn btn-secondary" onClick={handleSubmit}>
                Thêm khóa học
            </button>
            <button className="btn btn-secondary">
                Lưu nháp
            </button>
        </div>
    );
};

export default CourseActions; 