import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

//components
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/lessonDetails/sidebar";
import Body from "../../../components/lessonDetails/body";

//hooks
import { useAuth } from "../../../hooks/useAuth";
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer";
import { getLessonSections } from '../../../services/lessonService';

//style
import "../../../styles/lessonDetails/style.css"

const LessonDetails = () => {
    const { id: courseId, lessonId } = useParams();
    const [selectedSection, setSelectedSection] = useState(null);
    const [sections, setSections] = useState([]);
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    const handleExit = () => { };
    useCourseStudyTimer(handleExit, courseId);

    const handleSectionSelect = (section) => {
        setSelectedSection(section);
    };

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const sectionsData = await getLessonSections(lessonId);
                const sortedSections = [...sectionsData].sort((a, b) => a.viTri - b.viTri);
                setSections(sortedSections);

                if (sortedSections.length > 0 && !selectedSection) {
                    setSelectedSection(sortedSections[0]);
                }
            } catch (err) {
                console.error('Lỗi khi lấy danh sách phần học:', err);
            }
        };

        fetchSections();
    }, [lessonId, selectedSection]);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="lesson-details">
            <Navbar />
            <div className="lesson-details__main-content">
                <div className="lesson-details__content-container">
                    <Sidebar
                        onSectionSelect={handleSectionSelect}
                        selectedSectionId={selectedSection?.id}
                    />
                    <Body
                        selectedSection={selectedSection}
                        sections={sections}
                    />
                </div>
            </div>
        </div>
    );
}

export default LessonDetails;