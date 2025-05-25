import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/users/test/exercises/header";
import Body from "../../../components/users/test/exercises/body";
import Footer from "../../../components/users/test/exercises/footer";
import DialogPopup from "../../../components/users/test/dialogPopup";
import { useAuth } from "../../../hooks/useAuth";
import { useLevelAssessmentTest } from "../../../hooks/test/useExercise";
import { useSubmitTest } from "../../../hooks/test/useTest";
import "../../../styles/exercises/style.css";
import Error from "../../../components/layout/loader/error";
import Loader from "../../../components/layout/loader/loading";
import toast from "react-hot-toast";
import useTestLifecycle from "../../../hooks/test/useTestLifecycle";
import { clearStoredEndTime, clearTestAbandonedFlag } from "../../../components/users/test/testStorage"
import useExerciseInteraction from "../../../hooks/test/useExerciseInteraction"

const LevelAssessmentTest = () => {
    const { checkAuth, user } = useAuth();
    const authCheck = checkAuth();
    const navigate = useNavigate();

    const { id: courseId, lessonId, testId } = useParams();
    const { testExercise, loading: exerciseLoading, error: exerciseError } = useLevelAssessmentTest(courseId);
    const { executeSubmit, loading: submitLoading, error: submitError } = useSubmitTest();

    const [recommendationDetails, setRecommendationDetails] = useState(null);
    const [isRecommendationPopupOpen, setIsRecommendationPopupOpen] = useState(false);
    const [isCancelConfirmPopupOpen, setIsCancelConfirmPopupOpen] = useState(false);
    const [isSubmitConfirmPopupOpen, setIsSubmitConfirmPopupOpen] = useState(false);

    const { timeLeft, setTimeLeft, isAbandonedConfirmPopupOpen, setIsAbandonedConfirmPopupOpen, handleRestartAbandonedTest } = useTestLifecycle(testExercise, testId);
    console.log("testExercise: -----> ", testExercise);
    const {
        userAnswers, handleAnswerSelected, fontSize, autoNextQuestion,
        handleZoomIn, handleZoomOut, handleToggleAutoNext,
        //  resetUserAnswers
    } = useExerciseInteraction();

    const handleConfirmSubmit = useCallback(async () => {
        setIsSubmitConfirmPopupOpen(false);

        if (!user || !user.id) {
            toast.error("Bạn cần đăng nhập lại để nộp bài.");
            return navigate(`/login?redirect=/course/${courseId}/lesson/${lessonId}/test`);
        }

        if (!testExercise || !testExercise.id) {
            toast.error("Không tìm thấy thông tin bài thi để nộp bài.");
            return navigate(`/course/${courseId}/lesson/${lessonId}/test`);
        }

        const answersToSubmit = Object.entries(userAnswers).map(([questionId, answer]) => ({
            idExercise: parseInt(questionId),
            answer: answer,
        }));

        if (testId) {
            clearStoredEndTime(testId);
            clearTestAbandonedFlag(testId);
        }

        if (answersToSubmit.length < testExercise.exerciseList.length) {
            toast.error("Vui lòng hoàn thành tất cả câu hỏi trước khi nộp.")
            return;
        }

        const result = await executeSubmit(user.id, testExercise.id, answersToSubmit);

        if (result && result.statusCode === 200 && result.data) {
            if (result.data.recommendation && result.data.recommendation.lesson_id) {
                setRecommendationDetails(result.data.recommendation);
                setIsRecommendationPopupOpen(true);
            } else {
                toast.success(result.data.message || "Nộp bài thành công! Không có gợi ý bài học.");
                navigate(`/course/${courseId}/lesson/${lessonId}/test`);
            }
            setTimeLeft(0);
        } else {
            toast.error(`Nộp bài thất bại: ${submitError || (result && result.message) || "Vui lòng thử lại."}`);
        }
    }, [user, testExercise, userAnswers, executeSubmit, navigate, courseId, lessonId, submitError, testId, setTimeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && testExercise && !submitLoading && !isRecommendationPopupOpen && !isCancelConfirmPopupOpen && !isSubmitConfirmPopupOpen) {
            if (testId) {
                clearTestAbandonedFlag(testId);
            }
            handleConfirmSubmit();
        }
    }, [timeLeft, testExercise, testId, submitLoading, isRecommendationPopupOpen, isCancelConfirmPopupOpen, isSubmitConfirmPopupOpen, handleConfirmSubmit]);

    const handleSubmitButtonPressed = () => {
        setIsSubmitConfirmPopupOpen(true);
    };

    const closeSubmitConfirmPopup = () => {
        setIsSubmitConfirmPopupOpen(false);
    };

    const handleCancelTestRequest = () => {
        setIsCancelConfirmPopupOpen(true);
    };

    const confirmCancelTest = useCallback(() => {
        setIsCancelConfirmPopupOpen(false);
        if (testId) {
            clearStoredEndTime(testId);
            clearTestAbandonedFlag(testId);
        }
        navigate(`/course/${courseId}/lesson/${lessonId}/test`);
    }, [navigate, courseId, lessonId, testId]);

    const closeCancelConfirmPopup = () => {
        setIsCancelConfirmPopupOpen(false);
    };

    const confirmRecommendationNavigation = useCallback(() => {
        setIsRecommendationPopupOpen(false);
        if (recommendationDetails && recommendationDetails.lesson_id) {
            navigate(`/course/${courseId}/lesson/${recommendationDetails.lesson_id}`);
        }
        setRecommendationDetails(null);
    }, [navigate, courseId, recommendationDetails]);

    const closeRecommendationPopup = useCallback(() => {
        setIsRecommendationPopupOpen(false);
        setRecommendationDetails(null);
        navigate(`/course/${courseId}/lesson/${lessonId}/test`);
    }, [navigate, courseId, lessonId]);

    // Khi người dùng chọn "Không làm lại" (thoát) từ popup bỏ dở
    const handleLeaveAbandonedTest = useCallback(() => {
        clearTestAbandonedFlag(testId);
        clearStoredEndTime(testId);
        setIsAbandonedConfirmPopupOpen(false);
        navigate(`/course/${courseId}/lesson/${lessonId}/test`);
    }, [testId, navigate, courseId, lessonId, setIsAbandonedConfirmPopupOpen]);

    const formatTime = (seconds) => {
        if (seconds === null || seconds < 0) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!authCheck.shouldRender) return authCheck.component;
    if (exerciseLoading) return <div className="testExercise"><Loader text="Đang tải dữ liệu bài tập..." /></div>;
    if (exerciseError) return <div className="testExercise"><Error Title={`Lỗi tải bài tập: ${exerciseError.message || String(exerciseError)}`} /></div>;
    if (!testExercise || !testExercise.exerciseList || testExercise.exerciseList.length === 0) {
        return <div className="testExercise"><Error Title="Không tìm thấy dữ liệu bài tập hoặc bài tập không có câu hỏi." /></div>;
    }

    const answeredQuestionsCount = Object.keys(userAnswers).length;
    const totalQuestions = testExercise.exerciseList.length;

    const recommendationPopupMessage = recommendationDetails
        // ? `${recommendationDetails.message}. Bài học được đề xuất cho bạn: ${recommendationDetails.ten_bai_hoc}. Bấm xác nhận để chuyển đến bài học ngay.`
        // : "";
        ? `${recommendationDetails.message}. Bấm xác nhận để chuyển đến bài học ngay.`
        : "";

    return (
        <div className="testExercise">
            {submitLoading && <Loader text="Đang nộp bài..." />}
            <div className="testExercise__main-content">
                <Header
                    testName={testExercise.name}
                    totalQuestions={totalQuestions}
                    duration={testExercise.duration}
                    timeLeft={formatTime(timeLeft)}
                    answeredQuestionsCount={answeredQuestionsCount}
                    onSubmitTest={handleSubmitButtonPressed}
                    onCancelTest={handleCancelTestRequest}
                    isSubmitting={submitLoading}
                />
                <div className="testExercise__content-wrapper">
                    <Body
                        questions={testExercise.exerciseList}
                        fontSize={fontSize}
                        autoNextQuestionEnabled={autoNextQuestion}
                        onAnswerSelected={handleAnswerSelected}
                        userAnswers={userAnswers}
                    />
                </div>
                <Footer
                    fontSize={fontSize}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    autoNextQuestionEnabled={autoNextQuestion}
                    onToggleAutoNext={handleToggleAutoNext}
                />
            </div>

            <DialogPopup
                isOpen={isCancelConfirmPopupOpen}
                onClose={closeCancelConfirmPopup}
                onConfirm={confirmCancelTest}
                title="Xác nhận hủy bài làm"
                message="Bạn có chắc chắn muốn hủy bài làm? Mọi tiến trình sẽ không được lưu."
            />

            <DialogPopup
                isOpen={isSubmitConfirmPopupOpen}
                onClose={closeSubmitConfirmPopup}
                onConfirm={handleConfirmSubmit}
                title="Xác nhận nộp bài"
                message="Bạn có chắc chắn muốn nộp bài không?"
            />

            <DialogPopup
                isOpen={isAbandonedConfirmPopupOpen}
                onClose={() => {
                    handleLeaveAbandonedTest();
                }}
                onConfirm={handleRestartAbandonedTest}
                onCancel={handleLeaveAbandonedTest}
                title="Xác nhận làm bài"
                message="Bài kiểm tra này đã được bắt đầu và bạn có thể đã thoát giữa chừng. Bạn có muốn làm lại từ đầu không?"
            />

            {recommendationDetails && (
                <DialogPopup
                    isOpen={isRecommendationPopupOpen}
                    onClose={closeRecommendationPopup}
                    onConfirm={confirmRecommendationNavigation}
                    title="Gợi ý bài học cho bạn"
                    message={recommendationPopupMessage}
                />
            )}
        </div>
    );
};

export default LevelAssessmentTest;