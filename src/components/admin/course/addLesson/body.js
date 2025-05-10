import React, { useState } from "react";

//components
import SectionHeader from "../addSection/header";
import SectionBody from "../addSection/body";
import SectionFooter from "../addSection/footer";

//styles
import "../../../../styles/admin/addLesson/body.css";

const Body = ({
    lessonData,
    lessonErrors,
    handleLessonInputChange,
    handleSectionInputChange,
    sectionData,
    sectionErrors,
    handleUploadVideo,
    handleRemoveSection,
}) => {
    const [expandedSections, setExpandedSections] = useState(sectionData.map(() => true));

    const toggleExpand = (index) => {
        setExpandedSections(prev => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div className="addLesson-body">
            <div className="addLesson-body__form-group">
                <div className="addLesson-body__form-subgroup">
                    <label className="add-lesson__label">Tên bài học *</label>
                    <input
                        className={`add-lesson__input ${lessonErrors.tenBai ? 'input-error' : ''}`}
                        type="text"
                        placeholder="Nhập tên bài học"
                        value={lessonData?.tenBai || ''}
                        onChange={(e) => handleLessonInputChange('tenBai', e.target.value)}
                    />
                </div>
                <div className="addLesson-body__form-subgroup">
                    <label className="add-lesson__label">Từ khóa bài học</label>
                    <input
                        className="add-lesson__input"
                        type="text"
                        placeholder="Nhập từ khóa"
                    />
                </div>
            </div>

            {sectionData.map((section, index) => (
                <div key={index} className={`addSection-body__form-group ${!expandedSections[index] ? 'collapsed' : ''}`}>
                    <SectionHeader onToggle={() => toggleExpand(index)} isExpanded={expandedSections[index]} sectionNumber={index + 1} />
                    <div className="addSection-body__form-subgroup-container">
                        <SectionBody
                            sectionData={section}
                            formErrors={sectionErrors[index]}
                            handleInputChange={handleSectionInputChange}
                            handleUploadVideo={handleUploadVideo}
                            index={index}
                        />
                    </div>
                    <SectionFooter
                        handleRemoveSection={() => handleRemoveSection(index)}
                        handleUploadVideo={() => handleUploadVideo(index)}
                        isFirstSection={index === 0}
                    />
                </div>
            ))}
        </div>
    );
};

export default Body;
