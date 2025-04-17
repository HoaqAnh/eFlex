import React from 'react';

//component
import SectionActions from './addSectionAction';

//style
import '../../../styles/admin/addSection.css';

const AddSectionForm = ({
    sectionData,
    formErrors,
    handleInputChange,
    handleUploadVideo,
    handleAddSection,
    handleRemoveSection,
    isFirstSection = false,
    sectionNumber,
    index
}) => {
    return (
        <div className="add-section__form">
            <div className="add-section__header">
                <h3 className="add-section__title">Phần học {sectionNumber}</h3>
            </div>

            <div className="add-section__form-group">
                <label className="add-section__label">Tên phần học</label>
                <input
                    className="add-section__input"
                    type="text"
                    placeholder="Nhập tên phần học"
                    value={sectionData.tenBai || ''}
                    onChange={(e) => handleInputChange(index, 'tenBai', e.target.value)}
                />
                {formErrors.tenBai && (
                    <span className="error-message">{formErrors.tenBai}</span>
                )}

                <label className="add-section__label">Mô tả phần học</label>
                <textarea
                    className="add-section__textarea"
                    placeholder="Nhập mô tả phần học"
                    value={sectionData.moTa || ''}
                    onChange={(e) => handleInputChange(index, 'moTa', e.target.value)}
                />
                {formErrors.moTa && (
                    <span className="error-message">{formErrors.moTa}</span>
                )}
            </div>

            <SectionActions
                handleUploadVideo={() => handleUploadVideo(index)}
                handleRemoveSection={() => handleRemoveSection(index)}
                isFirstSection={isFirstSection}
            />
        </div>
    );
};

export default AddSectionForm;