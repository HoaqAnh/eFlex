import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/users/test/exercises/header";
import Body from "../../../components/users/test/exercises/body";
import Footer from "../../../components/users/test/exercises/footer";
import DialogPopup from "../../../components/users/test/dialogPopup";
import { useExercise } from "../../../hooks/test/useExercise";
import { useSubmitTest } from "../../../hooks/test/useTest";
import Error from "../../../components/layout/loader/error";
import Loader from "../../../components/layout/loader/loading";
import toast from "react-hot-toast";
import useTestLifecycle from "../../../hooks/test/useTestLifecycle";
import useExerciseInteraction from "../../../hooks/test/useExerciseInteraction"
import useGetUserData from "../../../hooks/useUserData";
import "../../../styles/exercises/style.css";
import {
    clearStoredEndTime, clearTestAbandonedFlag,
    getStoredUserAnswers, storeUserAnswers, clearStoredUserAnswers
} from "../../../components/users/test/testStorage";

const Exercises = () => {
    const navigate = useNavigate();
    const { id: courseId, lessonId, testId } = useParams();

    const { userData, loading: userDataLoading, error: userDataError } = useGetUserData();
    const { exercises, loading: exerciseLoading, error: exerciseError } = useExercise(testId ? testId : courseId, testId ? "Test" : "LevelAssessmentTest");
    const { executeSubmit, loading: submitLoading, error: submitError } = useSubmitTest();

    const [recommendationDetails, setRecommendationDetails] = useState(null);
    const [isRecommendationPopupOpen, setIsRecommendationPopupOpen] = useState(false);
    const [isCancelConfirmPopupOpen, setIsCancelConfirmPopupOpen] = useState(false);
    const [isSubmitConfirmPopupOpen, setIsSubmitConfirmPopupOpen] = useState(false);

    const { timeLeft, setTimeLeft,
        isAbandonedConfirmPopupOpen, setIsAbandonedConfirmPopupOpen,
        handleRestartAbandonedTest } = useTestLifecycle(exercises, exercises.testExerciseId);

    const {
        userAnswers, setUserAnswers, handleAnswerSelected,
        fontSize, autoNextQuestion,
        handleZoomIn, handleZoomOut,
        handleToggleAutoNext, resetUserAnswers
    } = useExerciseInteraction();

    const [answerInstanceKey, setAnswerInstanceKey] = useState(Date.now());

    useEffect(() => {
        if (exercises) {
            const loadedAnswers = getStoredUserAnswers(exercises.testExerciseId);
            if (loadedAnswers && Object.keys(loadedAnswers).length > 0) {
                setUserAnswers(loadedAnswers);
            } else {
                resetUserAnswers();
            }
        }
    }, [exercises.testExerciseId, exercises, answerInstanceKey, setUserAnswers, resetUserAnswers]);

    // Effect để lưu câu trả lời vào sessionStorage khi chúng thay đổi
    useEffect(() => {
        if (exercises.testExerciseId && userAnswers) {
            storeUserAnswers(exercises.testExerciseId, userAnswers);
        }
    }, [userAnswers, exercises.testExerciseId]);

    const handleConfirmSubmit = useCallback(async () => {
        setIsSubmitConfirmPopupOpen(false);

        if (!userData || !userData.id) {
            toast.error("Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại.");
            return navigate(`/login`);
        }

        if (!exercises || !exercises.testExerciseId) {
            toast.error("Không tìm thấy thông tin bài thi để nộp bài.");
            return navigate(lessonId ? `/course/${courseId}/lesson/${lessonId}/test` : `/course/${courseId}`);
        }

        const answersToSubmit = Object.entries(userAnswers).map(([questionId, answer]) => ({
            idExercise: parseInt(questionId),
            answer: answer,
        }));

        if (exercises.testExerciseId) {
            clearStoredEndTime(exercises.testExerciseId);
            clearTestAbandonedFlag(exercises.testExerciseId);
            clearStoredUserAnswers(exercises.testExerciseId);
        }

        if ((answersToSubmit.length < exercises.totalQuestion) && timeLeft > 0) {
            toast.error("Vui lòng hoàn thành tất cả câu hỏi trước khi nộp.")
            return;
        }

        const result = await executeSubmit(userData.id, answersToSubmit);

        if (result && result.statusCode === 200 && result.data) {
            if (result.data.recommendation && result.data.recommendation.lesson_id) {
                setRecommendationDetails(result.data.recommendation);
                setIsRecommendationPopupOpen(true);
            } else {
                toast.success(result.data.message || "Nộp bài thành công! Không có gợi ý bài học.");
                navigate(`/course/${courseId}`);
            }
            setTimeLeft(0);
        } else {
            toast.error(`Nộp bài thất bại: ${submitError || (result && result.message) || "Vui lòng thử lại."}`);
        }
    }, [userData, exercises, userAnswers, executeSubmit, navigate, courseId, submitError, lessonId, setTimeLeft, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && exercises && !submitLoading && !isRecommendationPopupOpen && !isCancelConfirmPopupOpen && !isSubmitConfirmPopupOpen) {
            if (exercises.testExerciseId) {
                clearTestAbandonedFlag(exercises.testExerciseId);
            }
            handleConfirmSubmit();
        }
    }, [timeLeft, exercises, exercises.testExerciseId, submitLoading, isRecommendationPopupOpen, isCancelConfirmPopupOpen, isSubmitConfirmPopupOpen, handleConfirmSubmit]);

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
        if (exercises.testExerciseId) {
            clearStoredEndTime(exercises.testExerciseId);
            clearTestAbandonedFlag(exercises.testExerciseId);
            clearStoredUserAnswers(exercises.testExerciseId);
        }
        navigate(lessonId ? `/course/${courseId}/lesson/${lessonId}/test` : `/course/${courseId}`);
    }, [navigate, courseId, lessonId, exercises.testExerciseId]);

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
        navigate(`/course/${courseId}`);
    }, [navigate, courseId]);

    const handleRestartTestFlow = useCallback(() => {
        handleRestartAbandonedTest();
        resetUserAnswers();
        clearStoredUserAnswers(exercises.testExerciseId);
        setIsAbandonedConfirmPopupOpen(false);
        setAnswerInstanceKey(Date.now());
    }, [handleRestartAbandonedTest, resetUserAnswers, exercises.testExerciseId, setIsAbandonedConfirmPopupOpen]);

    const handleLeaveAbandonedTest = useCallback(() => {
        if (exercises.testExerciseId) {
            clearTestAbandonedFlag(exercises.testExerciseId);
            clearStoredEndTime(exercises.testExerciseId);
            clearStoredUserAnswers(exercises.testExerciseId);
        }
        navigate(lessonId ? `/course/${courseId}/lesson/${lessonId}/test` : `/course/${courseId}`);
        setIsAbandonedConfirmPopupOpen(false);
    }, [exercises.testExerciseId, navigate, courseId, lessonId, setIsAbandonedConfirmPopupOpen]);

    const formatTime = (seconds) => {
        if (seconds === null || seconds < 0) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (exerciseLoading || userDataLoading) return <div className="exercises"><Loader text="Đang tải dữ liệu bài tập..." /></div>;
    if (exerciseError || userDataError) return <div className="exercises"><Error Title={`Lỗi tải bài tập: ${exerciseError.message || String(exerciseError)}`} /></div>;
    if (!exercises) {
        return <div className="exercises"><Error Title="Không tìm thấy dữ liệu bài tập hoặc bài tập không có câu hỏi." /></div>;
    }

    const answeredQuestionsCount = Object.keys(userAnswers).length;
    const recommendationPopupMessage = recommendationDetails ? `${recommendationDetails.message}. Bấm xác nhận để chuyển đến bài học ngay.` : "";

    return (
        <div className="exercises">
            {submitLoading && <Loader text="Đang nộp bài..." />}
            <div className="exercises__main-content">
                <Header
                    testName={exercises.name}
                    totalQuestions={exercises.totalQuestion}
                    duration={exercises.duration}
                    timeLeft={formatTime(timeLeft)}
                    answeredQuestionsCount={answeredQuestionsCount}
                    onSubmitTest={handleSubmitButtonPressed}
                    onCancelTest={handleCancelTestRequest}
                />
                <div className="exercises__content-wrapper">
                    <Body
                        questions={exercises.data}
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
                onConfirm={handleRestartTestFlow}
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

export default Exercises;