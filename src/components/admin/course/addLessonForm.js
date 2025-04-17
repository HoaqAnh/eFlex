import React from 'react';

//style
import "../../../styles/admin/addLesson.css";

//component
import AddSectionForm from "./addSectionForm";

const LessonForm = ({
    lessonData,
    lessonErrors,
    sectionForms,
    sectionErrors,
    handleLessonInputChange,
    handleSectionInputChange,
    handleAddSection,
    handleRemoveSection
}) => {
    const handleUploadVideo = (index) => {
        // TODO: Implement video upload functionality
        console.log("Upload video for section", index);
    };

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
                        onChange={(e) => handleLessonInputChange('tenBai', e.target.value)}
                    />
                    {lessonErrors.tenBai && (
                        <span className="error-message">{lessonErrors.tenBai}</span>
                    )}
                </div>

                {sectionForms.map((section, index) => (
                    <div key={section.id} className="add-section__form-group">
                        <AddSectionForm
                            sectionData={section}
                            formErrors={sectionErrors[index]}
                            handleInputChange={handleSectionInputChange}
                            handleUploadVideo={handleUploadVideo}
                            handleAddSection={handleAddSection}
                            handleRemoveSection={() => handleRemoveSection(index)}
                            isFirstSection={index === 0}
                            sectionNumber={index + 1}
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonForm;