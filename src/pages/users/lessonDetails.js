import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import Sidebar from "../../components/lessonDetails/sidebar";
import Body from "../../components/lessonDetails/body";
import Footer from "../../components/lessonDetails/footer";

//hooks
import { useAuth } from "../../hooks/useAuth";
import { getLessonSections } from '../../services/lessonService';

//style
import "../../styles/lessonDetails/style.css"

function LessonDetails() {
    const { isAuthenticated, isLoading, error } = useAuth();
    const { lessonId } = useParams();
    const [selectedSection, setSelectedSection] = useState(null);
    const [sections, setSections] = useState([]);

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

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleSectionSelect = (section) => {
        setSelectedSection(section);
    };

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