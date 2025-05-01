import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import Sidebar from "../../components/lessonDetails/sidebar";
import Body from "../../components/lessonDetails/body";
import Footer from "../../components/lessonDetails/footer";

//hooks
import { useAuth } from "../../hooks/useAuth";
import useCourseStudyTimer from "../../hooks/courses/useCourseStudyTimer";
import { getLessonSections } from '../../services/lessonService';

//style
import "../../styles/lessonDetails/style.css"

const LessonDetails = () => {
    const { id: courseId, lessonId } = useParams();
    const [selectedSection, setSelectedSection] = useState(null);
    const [sections, setSections] = useState([]);
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    const handleExit = () => {};
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
            } catch (err) {
                console.error('Lỗi khi lấy danh sách phần học:', err);
            }
        };

        fetchSections();
    }, [lessonId]);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="lesson-details">
            <Navbar />
            <div className="lesson-details__main-content">
                <div className="lesson-details__content-wrapper">
                    <Sidebar onSectionSelect={handleSectionSelect} />
                    <div className="lesson-details__body-container">
                        <Body selectedSection={selectedSection} />
                        <Footer
                            selectedSection={selectedSection}
                            sections={sections}
                            onSectionSelect={handleSectionSelect}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LessonDetails;