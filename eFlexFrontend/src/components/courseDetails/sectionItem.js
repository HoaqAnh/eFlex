import React from "react";
import { useGetProgress } from "../../hooks/progress/useProgress";
import { IconCompleted, IconNotCompleted } from "./icons";
import "../../styles/courseDetails/sectionItem.css";

const SectionItem = ({ userId, courseId, lessonId, section }) => {
    const {
        isEntityCompleted: isSectionCompleted,
        isProgressLoading: isSectionProgressLoading,
    } = useGetProgress(userId, section.id, "section");

    const handleNavigateToSection = () => {
        // navigate(`/course/${courseId}/lesson/${lessonId}/section/${section.id}`);
        console.log(`Navigating to Section ${section.id}, Completed: ${isSectionCompleted}`);
    };

    const SectionStatusIcon = () => {
        if (isSectionProgressLoading) return <span className="status-icon loading-icon"></span>;
        return isSectionCompleted ? <IconCompleted /> : <IconNotCompleted />;
    };

    return (
        <div className="section-item" key={section.id} onClick={handleNavigateToSection}>
            <SectionStatusIcon />
            <span className="section-name">{section.tenBai || "Tên mục không xác định"}</span>
        </div>
    );
};

export default SectionItem;