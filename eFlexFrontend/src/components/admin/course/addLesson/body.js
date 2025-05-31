import React, { useState, useEffect, useRef } from "react";
import SectionHeader from "../addSection/header";
import SectionBody from "../addSection/body";
import SectionFooter from "../addSection/footer";
import "../../../../styles/admin/addLesson/body.css";

const Body = ({
    lessonData,
    lessonErrors,
    handleLessonInputChange,
    handleSectionInputChange,
    sectionData,
    sectionErrors,
    onTriggerUpload,
    onRemoveSelectedVideo,
    onRemoveWholeSection
}) => {
    const [expandedSections, setExpandedSections] = useState(() => sectionData.map(() => true));
    const prevSectionCountRef = useRef(sectionData.length);
    const sectionElementRefs = useRef([]);

    useEffect(() => {
        const currentSectionCount = sectionData.length;
        const previousSectionCount = prevSectionCountRef.current;

        if (sectionElementRefs.current.length !== currentSectionCount) {
            sectionElementRefs.current = Array(currentSectionCount).fill(null).map(
                (_, i) => sectionElementRefs.current[i] || React.createRef()
            );
        }

        if (expandedSections.length !== currentSectionCount && previousSectionCount === currentSectionCount) {
            setExpandedSections(Array(currentSectionCount).fill(true));
        }


        if (currentSectionCount > previousSectionCount) {
            setExpandedSections(() => {
                const newExpandedState = Array(currentSectionCount).fill(false);
                if (currentSectionCount > 0) {
                    newExpandedState[currentSectionCount - 1] = true;
                }
                return newExpandedState;
            });

            setTimeout(() => {
                const newSectionIndex = currentSectionCount - 1;
                if (newSectionIndex >= 0 && sectionElementRefs.current[newSectionIndex] && sectionElementRefs.current[newSectionIndex].current) {
                    sectionElementRefs.current[newSectionIndex].current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        } else if (currentSectionCount < previousSectionCount) {
            setExpandedSections(currentExpanded => currentExpanded.slice(0, currentSectionCount));
        }

        prevSectionCountRef.current = currentSectionCount;

    }, [sectionData]);

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
            </div>

            {sectionData.map((section, index) => {
                const currentSectionSpecificErrors = sectionErrors && sectionErrors[index] ? sectionErrors[index] : {};
                const hasErrorInThisSection = Object.values(currentSectionSpecificErrors).some(errorMessage => errorMessage && errorMessage.length > 0);
                return (
                    <div key={section.id || index}
                        ref={sectionElementRefs.current[index]}
                        className={`addSection-body__form-group ${expandedSections[index] === false ? 'collapsed' : ''} ${hasErrorInThisSection ? 'section-with-errors' : ''}`}
                    >
                        <SectionHeader
                            onToggle={() => toggleExpand(index)}
                            isExpanded={expandedSections[index] === undefined ? true : expandedSections[index]}
                            sectionNumber={index + 1}
                        />
                        <div className="addSection-body__form-subgroup-container">
                            <SectionBody
                                sectionData={section}
                                formErrors={currentSectionSpecificErrors}
                                handleInputChange={handleSectionInputChange}
                                index={index}
                            />
                        </div>
                        <SectionFooter
                            onRemoveWholeSection={() => onRemoveWholeSection(index)}
                            onTriggerUpload={() => onTriggerUpload(index)}
                            isFirstSection={index === 0}
                            currentVideoFile={section.videoFile}
                            onRemoveVideoFile={() => onRemoveSelectedVideo(index)}
                        />
                    </div>
                );
            })}
        </div >
    );
};

export default Body;
