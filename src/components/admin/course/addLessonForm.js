import React from 'react';

//style
import "../../../styles/admin/addLesson.css";

//component
import SectionActions from "./addSectionAction";

//hook
// import { useAddSection } from "../../../hooks/admin/useAddSection";

const LessonForm = ({
    lessonData,
    formErrors,
    handleInputChange,
    handleUploadVideo,
    handleAddSection,
    handleUploadTest
}) => {
    return (
        <div className="add-lesson__form">
            <div className="add-lesson__content-wrapper">
                <div className="add-lesson__header">
                    <h2 className="add-lesson__title">Thêm bài học</h2>
                </div>

                <div className="add-lesson__form-group">
                    <label className="add-lesson__label">Tên bài học</label>
                    <input
                        className="add-lesson__input"
                        type="text"
                        placeholder="Nhập tên bài học"
                        value={lessonData.tenBai || ''}
                        onChange={(e) => handleInputChange('tenBai', e.target.value)}
                    />
                    {formErrors.tenBai && (
                        <span className="error-message">{formErrors.tenBai}</span>
                    )}
                </div>

                <div className="add-section__form-group">
                    <label className="add-section__label">Phần học</label>
                    <input
                        className="add-section__input"
                        type="text"
                        placeholder="Nhập tên phần học"
                    />
                    <textarea
                        className="add-section__input"
                        type="text"
                        placeholder="Nhập nội dung phần học"
                    />
                    <SectionActions 
                        handleUploadVideo={handleUploadVideo}
                        handleAddSection={handleAddSection}
                        handleUploadTest={handleUploadTest}
                    />
                </div>
            </div>
        </div>
    );
};

export default LessonForm;