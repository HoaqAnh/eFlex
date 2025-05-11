import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/lessonDetails/sidebar";
import Body from "../../../components/lessonDetails/body";
import Loading from "../../../components/layout/loader/loading"
import { useLessonDetail } from '../../../hooks/course/useLesson';
import { useAuth } from "../../../hooks/useAuth";
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer";
import "../../../styles/lessonDetails/style.css"

const LessonDetails = () => {
    const { id: courseId, lessonId } = useParams();
    const [selectedSection, setSelectedSection] = useState(null);
    const { lessonData, loading, error } = useLessonDetail(lessonId);
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    const handleExit = () => { };
    useCourseStudyTimer(handleExit, courseId);

    const handleSectionSelect = (lessonData) => {
        setSelectedSection(lessonData);
    };

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="lesson-details">
            {error && <div className='error-message'>Có lỗi xảy ra vui lòng thử lại sau.</div>}
            {loading ? (
                <Loading Title="Đang tải nội dung bài học..."/>
            ) : (
                <>
                    <Sidebar
                        onSectionSelect={handleSectionSelect}
                        selectedSectionId={selectedSection?.id}
                    />
                    <Body
                        selectedSection={selectedSection}
                        sections={lessonData}
                    />
                </>
            )}
        </div >
    );
}

export default LessonDetails;