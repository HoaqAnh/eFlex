import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/lessonDetails/sidebar";
import Body from "../../../components/lessonDetails/body";
import ConfirmDialog from '../../../components/users/test/dialogPopup';
import Loading from "../../../components/layout/loader/loading"
import Error from "../../../components/layout/loader/error"
import useCourseStudyTimer from "../../../hooks/model/useCourseStudyTimer";
import { useProgress } from '../../../hooks/progress/useProgress';
import { useLessonDetail } from '../../../hooks/course/useLesson';
import { useSections } from '../../../hooks/course/useSection';
import "../../../styles/lessonDetails/style.css"
import toast from "react-hot-toast";

const LessonDetails = () => {
    const { id: courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { sendSectionProgress } = useProgress();
    const [selectedSection, setSelectedSection] = useState(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showTestConfirm, setShowTestConfirm] = useState(false);

    const { lessonData, loading: lessonLoading, error: lessonError } = useLessonDetail(lessonId, courseId);
    const { listSection, loading: sectionsLoading, error: sectionsError } = useSections(lessonId);

    useEffect(() => {

        if (listSection && listSection.length > 0 && !selectedSection) {
            setSelectedSection(listSection[0]);
        }
    }, [listSection, selectedSection]);

    const handleExit = (TestConfirm, confirmed) => {
        if (TestConfirm) {
            setShowTestConfirm(false);
            if (confirmed) navigate("test");
        } else {
            setShowExitConfirm(false);
            if (confirmed) navigate(`/course/${courseId}`);
        }
    };

    useCourseStudyTimer(handleExit, courseId);

    const onSectionSelect = (section) => {
        setSelectedSection(section);
    };

    const handleSectionClick = (section) => {
        if (selectedSection && selectedSection.id) {
            toast.promise(
                sendSectionProgress(selectedSection.id),
                {
                    loading: 'Saving...',
                    success: <b>Cập nhật tiến dộ thành công!</b>,
                    error: <b>Tiến độ chưa được lưu, vui lòng thử lại.</b>,
                }
            );
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

        if (selectedSection) {
            toast.promise(
                sendSectionProgress(selectedSection.id),
                {
                    loading: 'Saving...',
                    success: <b>Cập nhật tiến dộ thành công!</b>,
                    error: <b>Tiến độ chưa được lưu, vui lòng thử lại.</b>,
                }
            );
        }

        if (currentIndex < listSection.length - 1) {
            const nextSection = listSection[currentIndex + 1];
            onSectionSelect(nextSection);
        } else {
            setShowTestConfirm(true);
        }
    };

    const loading = lessonLoading || sectionsLoading;
    const error = lessonError || sectionsError;

    if (error) {
        return (
            <div className="lesson-details">
                <Error Title="Có lỗi xảy ra vui lòng thử lại sau ít phút." />
            </div>
        );
    }

    return (
        <div className="lesson-details">
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
                        onConfirm={() => handleExit(false, true)}
                        onClose={() => handleExit(false, false)}
                    />

                    <ConfirmDialog
                        isOpen={showTestConfirm}
                        title="Xác nhận làm bài kiểm tra"
                        message="Bạn có muốn làm bài kiểm tra để đánh giá năng lực của mình không?"
                        onConfirm={() => handleExit(true, true)}
                        onClose={() => handleExit(true, false)}
                    />
                </>
            )}
        </div >
    );
}

export default LessonDetails;