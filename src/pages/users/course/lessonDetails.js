import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/lessonDetails/sidebar";
import Body from "../../../components/lessonDetails/body";
import ConfirmDialog from '../../../components/lessonDetails/confirmDialog';
import Loading from "../../../components/layout/loader/loading"
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer";
import { useProgress } from '../../../hooks/progress/useProgress';
import { useLessonDetail } from '../../../hooks/course/useLesson';
import { useSections } from '../../../hooks/course/useSection';
import { useAuth } from "../../../hooks/useAuth";
import "../../../styles/lessonDetails/style.css"

const LessonDetails = () => {
    const { id: courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { sendSectionProgress } = useProgress();
    const [selectedSection, setSelectedSection] = useState(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showTestConfirm, setShowTestConfirm] = useState(false);
    
    const { lessonData, loading: lessonLoading, error: lessonError } = useLessonDetail(lessonId);
    const { listSection, loading: sectionsLoading, error: sectionsError } = useSections(lessonId);
    
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    // Khởi tạo section đầu tiên khi dữ liệu được tải xong
    useEffect(() => {

        if (listSection && listSection.length > 0 && !selectedSection) {
            setSelectedSection(listSection[0]);
        }
    }, [listSection, selectedSection]);

    const handleExit = () => {
        navigate(`/course/${courseId}`);
    };
    
    useCourseStudyTimer(handleExit, courseId);

    const onSectionSelect = (section) => {
        setSelectedSection(section);
    };

    const handleSectionClick = (section) => {
        if (selectedSection && selectedSection.id) {
            sendSectionProgress(selectedSection.id);
        }

        onSectionSelect(section);
    };

    const handlePrevious = () => {
        if (!selectedSection || !selectedSection.id || !listSection?.length) return;

        const currentIndex = listSection.findIndex(s => s.id === selectedSection.id);
        if (currentIndex > 0) {
            const previousSection = listSection[currentIndex - 1];
            onSectionSelect(previousSection);
        } else {
            setShowExitConfirm(true);
        }
    };

    const handleNext = () => {
        if (!selectedSection || !selectedSection.id || !listSection?.length) return;

        const currentIndex = listSection.findIndex(s => s.id === selectedSection.id);

        // Gửi tiến trình cho section hiện tại
        if (selectedSection) {
            sendSectionProgress(selectedSection.id);
        }

        if (currentIndex < listSection.length - 1) {
            const nextSection = listSection[currentIndex + 1];
            onSectionSelect(nextSection);
        } else {
            setShowTestConfirm(true);
        }
    };

    const handleExitConfirm = (confirmed) => {
        setShowExitConfirm(false);
        if (confirmed) {
            navigate(`/course/${courseId}`);
        }
    };

    const handleTestConfirm = (confirmed) => {
        setShowTestConfirm(false);
        if (confirmed) {
            navigate(`/course/${courseId}/lesson/${lessonId}/test`);
        }
    };

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    const loading = lessonLoading || sectionsLoading;
    const error = lessonError || sectionsError;

    return (
        <div className="lesson-details">
            {error && <div className='error-message'>Có lỗi xảy ra vui lòng thử lại sau.</div>}
            {loading ? (
                <Loading Title="Đang tải nội dung bài học..." />
            ) : (
                <>
                    <Sidebar
                        selectedSection={selectedSection}
                        currentLesson={lessonData}
                        sections={listSection}
                        handleSectionClick={handleSectionClick}
                        handlePrevious={handlePrevious}
                        handleNext={handleNext}
                    />
                    <Body
                        selectedSection={selectedSection}
                    />
                    <ConfirmDialog
                        isOpen={showExitConfirm}
                        title="Xác nhận thoát"
                        message="Bạn có chắc chắn muốn thoát khỏi bài học này?"
                        onConfirm={() => handleExitConfirm(true)}
                        onCancel={() => handleExitConfirm(false)}
                    />

                    <ConfirmDialog
                        isOpen={showTestConfirm}
                        title="Xác nhận làm bài kiểm tra"
                        message="Bạn có muốn làm bài kiểm tra để chuyển sang bài học tiếp theo không?"
                        onConfirm={() => handleTestConfirm(true)}
                        onCancel={() => handleTestConfirm(false)}
                    />
                </>
            )}
        </div >
    );
}

export default LessonDetails;