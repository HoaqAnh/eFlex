import React from "react";
import "../../styles/lessonDetails/sidebar.css"

const Sidebar = ({ selectedSection, currentLesson, sections, handleSectionClick, handlePrevious, handleNext }) => {
    return (
        <div className="lesson-details__sidebar">
            <div className="lesson-details__sidebar-content">
                <div className="lesson-details__sidebar-content-header">
                    <h2>{currentLesson?.tenBai || "Chọn một bài học để bắt đầu"}</h2>
                </div>
                <div className="lesson-details__sidebar-content-body">
                    {sections && sections.map((section) => (
                        <div
                            className={`lesson-details__sidebar-content-body-item 
                                ${selectedSection && selectedSection.id === section.id ? "active" : ""}`}
                            key={section.id}
                            onClick={() => handleSectionClick(section)}
                        >
                            <p>{section.tenBai}</p>
                        </div>
                    ))}
                </div>
                <div className="lesson-details__sidebar-content-footer">
                    <div className="lesson-details__sidebar-action-buttons">
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
                </div>
            </div>
        </div>
    );
}

export default Sidebar;