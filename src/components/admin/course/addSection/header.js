import React from "react";

//styles
import "../../../../styles/admin/addSection/header.css";

const SectionHeader = ({ onToggle, isExpanded, sectionNumber }) => {
    return (
        <div className="addSection-header">
            <h2>Phần học {sectionNumber}</h2>
            <button
                className="btn btn-section-secondary"
                onClick={onToggle}
            >
                {isExpanded ? (
                    <p>Thu gọn</p>
                ) : (
                    <p>Mở rộng</p>
                )}
            </button>
        </div>
    );
};

export default SectionHeader;
