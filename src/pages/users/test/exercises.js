import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/users/test/exercises/header";
import Body from "../../../components/users/test/exercises/body";
import Footer from "../../../components/users/test/exercises/footer";
import DialogPopup from "../../../components/users/test/dialogPopup";
import { useAuth } from "../../../hooks/useAuth";
import { useExercise } from "../../../hooks/test/useExercise";
import { useSubmitTest } from "../../../hooks/test/useTest";
import "../../../styles/exercises/style.css";
import Error from "../../../components/layout/loader/error";
import Loader from "../../../components/layout/loader/loading";
import toast from "react-hot-toast";

const Exercises = () => {
    const { checkAuth, user } = useAuth();
    const authCheck = checkAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const prevLocationPathRef = useRef(location.pathname);
    const { id: courseId, lessonId, testId } = useParams();
    const { exercises, loading: exerciseLoading, error: exerciseError } = useExercise(testId);
    const { executeSubmit, loading: submitLoading, error: submitError } = useSubmitTest();

    const [fontSize, setFontSize] = useState(16);
    const [autoNextQuestion, setAutoNextQuestion] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);

    const [recommendationDetails, setRecommendationDetails] = useState(null);
    const [isRecommendationPopupOpen, setIsRecommendationPopupOpen] = useState(false);
    const [isCancelConfirmPopupOpen, setIsCancelConfirmPopupOpen] = useState(false);
    const [isSubmitConfirmPopupOpen, setIsSubmitConfirmPopupOpen] = useState(false);
    const [isAbandonedConfirmPopupOpen, setIsAbandonedConfirmPopupOpen] = useState(false);
    const [testInstanceKey, setTestInstanceKey] = useState(Date.now());

    // Effect 1: Khởi tạo timeLeft và userAnswers DỰA TRÊN exercises và localStorage
    useEffect(() => {
        if (exercises && testId) {
            const isAbandoned = getTestAbandonedFlag(testId);
            const storedEndTime = getStoredEndTime(testId);
            const now = Date.now();

            if (isAbandoned && storedEndTime && storedEndTime > now) {
                // 1. Bị bỏ dở, còn hạn, còn thời gian -> hiển thị popup
                setIsAbandonedConfirmPopupOpen(true);
                setTimeLeft(0); // Tạm dừng timer
                // Không xóa cờ 'isAbandoned' ở đây. Chờ người dùng quyết định.
                return; // Dừng ở đây, chờ popup xử lý
            }

            // Nếu không rơi vào trường hợp 'isAbandoned' ở trên (ví dụ: không bị bỏ dở,
            // hoặc storedEndTime đã qua, hoặc người dùng đã xử lý popup trước đó
            // và testInstanceKey đã trigger useEffect này chạy lại)
            // thì mới tiến hành logic khởi tạo/tiếp tục bình thường.

            // Nếu cờ 'isAbandoned' vẫn còn (ví dụ, do storedEndTime đã qua khi kiểm tra ở trên),
            // nhưng chúng ta không hiển thị popup, thì nên xóa nó đi.
            if (isAbandoned) {
                clearTestAbandonedFlag(testId);
            }

            if (storedEndTime && storedEndTime > now) {
                // 2. Không bị bỏ dở (hoặc đã xử lý), còn hạn, còn thời gian -> Tiếp tục
                const remainingSeconds = Math.max(0, Math.floor((storedEndTime - now) / 1000));
                setTimeLeft(remainingSeconds);
                setUserAnswers({}); // Hoặc khôi phục userAnswers từ localStorage nếu bạn muốn
            } else {
                // 3. Hết hạn hoặc bắt đầu mới
                if (storedEndTime && storedEndTime <= now) {
                    clearStoredEndTime(testId); // Xóa endTime đã hết hạn
                }
                // Bắt đầu bài thi mới hoàn toàn
                // Kiểm tra exercises.duration có phải là số hợp lệ không
                if (exercises && typeof exercises.duration === 'number' && exercises.duration > 0) {
                    const durationInSeconds = exercises.duration * 60;
                    const newEndTime = now + durationInSeconds * 1000;
                    storeEndTime(testId, newEndTime);
                    setTimeLeft(durationInSeconds);
                } else {
                    // Nếu không có duration hoặc duration không hợp lệ, đặt timeLeft là 0
                    setTimeLeft(0);
                }
                setUserAnswers({}); // Reset câu trả lời cho bài mới
            }
        }
    }, [exercises, testId, testInstanceKey]);

    const handleConfirmSubmit = useCallback(async () => {
        setIsSubmitConfirmPopupOpen(false);

        if (!user || !user.id) {
            toast.error("Bạn cần đăng nhập lại để nộp bài.");
            return navigate(`/login?redirect=/course/${courseId}/lesson/${lessonId}/test`);
        }

        if (!exercises || !exercises.id) {
            toast.error("Không tìm thấy thông tin bài thi để nộp bài.");
            return navigate(`/course/${courseId}/lesson/${lessonId}/test`);
        }

        const answersToSubmit = Object.entries(userAnswers).map(([questionId, answer]) => ({
            idExercise: parseInt(questionId),
            answer: answer,
        }));

        // Sau khi nộp bài (thành công hay thất bại đều nên xóa timer)
        if (testId) { // Đảm bảo testId tồn tại
            clearStoredEndTime(testId);
            clearTestAbandonedFlag(testId);
        }

        const result = await executeSubmit(user.id, exercises.id, answersToSubmit);

        if (result && result.statusCode === 200 && result.data) {
            if (result.data.recommendation && result.data.recommendation.lesson_id) {
                setRecommendationDetails(result.data.recommendation);
                setIsRecommendationPopupOpen(true);
            } else {
                toast.success(result.data.message || "Nộp bài thành công! Không có gợi ý bài học.");
                navigate(`/course/${courseId}/lesson/${lessonId}/test`);
            }
        } else {
            toast.error(`Nộp bài thất bại: ${submitError || (result && result.message) || "Vui lòng thử lại."}`);
        }
    }, [user, exercises, userAnswers, executeSubmit, navigate, courseId, lessonId, submitError, testId]);

    // Effect 2: Quản lý Timer
    useEffect(() => {
        // Điều kiện 1: Nếu timeLeft chưa được khởi tạo (vẫn là null), không làm gì cả.
        if (timeLeft === null) {
            return;
        }

        // Điều kiện 2: Xử lý khi thời gian còn lại <= 0
        if (timeLeft <= 0) {
            // Chỉ tự động nộp bài khi timeLeft CHÍNH XÁC bằng 0
            // và CÓ exercises (để đảm bảo có exercises.id cho handleConfirmSubmit)
            // và không có popup nào đang mở cản trở việc nộp bài
            if (timeLeft === 0 && exercises && exercises.id && !submitLoading && !isRecommendationPopupOpen && !isCancelConfirmPopupOpen && !isSubmitConfirmPopupOpen) {
                console.log("Time is up! Auto-submitting...");
                if (testId) {
                    clearTestAbandonedFlag(testId);
                }
                handleConfirmSubmit();
            }
            return; // Dừng ở đây nếu thời gian đã hết hoặc bằng 0
        }

        // Điều kiện 3: Nếu thời gian vẫn còn (timeLeft > 0) VÀ CÓ exercises, bắt đầu đếm ngược
        if (exercises) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1;
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(timerId); // Cleanup interval khi component unmount hoặc dependencies thay đổi
        }

    }, [timeLeft, exercises, testId, submitLoading, isRecommendationPopupOpen, isCancelConfirmPopupOpen, isSubmitConfirmPopupOpen, handleConfirmSubmit]);

    // Effect để phát hiện rời khỏi trang bài thi
    useEffect(() => {
        const previousPath = prevLocationPathRef.current;
        const currentPath = location.pathname;
        const currentTestUrl = `/course/${courseId}/lesson/${lessonId}/test/${testId}`;

        // Kiểm tra xem người dùng có phải đã rời từ trang bài thi này không
        if (previousPath === currentTestUrl && currentPath !== currentTestUrl) {
            // Chỉ đặt cờ nếu còn thời gian làm bài đã lưu (nghĩa là họ đang làm dở)
            if (getStoredEndTime(testId)) {
                setTestAbandonedFlag(testId);
            }
        }

        // Cập nhật ref cho lần thay đổi location tiếp theo
        prevLocationPathRef.current = currentPath;
    }, [location.pathname, courseId, lessonId, testId]);

    const handleAnswerSelected = useCallback((questionId, answerKey) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answerKey
        }));
    }, []);


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

    // Khi người dùng chọn "Làm lại bài" từ popup bỏ dở
    const handleRestartAbandonedTest = useCallback(() => {
        clearTestAbandonedFlag(testId);
        clearStoredEndTime(testId); // Xóa thông tin thời gian cũ
        setIsAbandonedConfirmPopupOpen(false);
        setUserAnswers({}); // Reset câu trả lời
        // Trigger useEffect chính chạy lại để khởi tạo bài mới
        // bằng cách thay đổi một key mà useEffect đó phụ thuộc vào,
        // hoặc reload component bằng cách thay đổi key của nó ở cấp cha.
        // Đơn giản nhất ở đây là thay đổi một state để useEffect chạy lại.
        // Chúng ta sẽ thêm testInstanceKey vào dependencies của useEffect chính.
        setTestInstanceKey(Date.now());
    }, [testId]);

    // Khi người dùng chọn "Không làm lại" (thoát) từ popup bỏ dở
    const handleLeaveAbandonedTest = useCallback(() => {
        clearTestAbandonedFlag(testId);
        clearStoredEndTime(testId);
        setIsAbandonedConfirmPopupOpen(false);
        navigate(`/course/<span class="math-inline">\{courseId\}/lesson/</span>{lessonId}/test`);
    }, [testId, navigate, courseId, lessonId]);

    // Helper function để lấy testId từ localStorage
    const getStoredEndTime = (testId) => {
        const storedEndTimeString = localStorage.getItem(`testEndTime_${testId}`);
        return storedEndTimeString ? parseInt(storedEndTimeString, 10) : null;
    };

    // Helper function để lưu testId vào localStorage
    const storeEndTime = (testId, endTime) => {
        localStorage.setItem(`testEndTime_${testId}`, endTime.toString());
    };

    // Helper function để xóa testId khỏi localStorage
    const clearStoredEndTime = (testId) => {
        localStorage.removeItem(`testEndTime_${testId}`);
    };

    // Helper functions cho cờ 'testAbandoned'
    const getTestAbandonedFlag = (testId) => {
        if (!testId) return false;
        return localStorage.getItem(`testAbandoned_${testId}`) === 'true';
    };

    const setTestAbandonedFlag = (testId) => {
        if (!testId) return;
        localStorage.setItem(`testAbandoned_${testId}`, 'true');
    };

    const clearTestAbandonedFlag = (testId) => {
        if (!testId) return;
        localStorage.removeItem(`testAbandoned_${testId}`);
    };

    const handleZoomIn = useCallback(() => setFontSize(prevSize => Math.min(prevSize + 2, 28)), []);
    const handleZoomOut = useCallback(() => setFontSize(prevSize => Math.max(prevSize - 2, 12)), []);
    const handleToggleAutoNext = useCallback(() => setAutoNextQuestion(prev => !prev), []);

    const formatTime = (seconds) => {
        if (seconds === null || seconds < 0) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!authCheck.shouldRender) return authCheck.component;
    if (exerciseLoading) return <div className="exercises"><Loader text="Đang tải dữ liệu bài tập..." /></div>;
    // Xử lý lỗi khi fetch exercises
    if (exerciseError) return <div className="exercises"><Error Title={`Lỗi tải bài tập: ${exerciseError.message || String(exerciseError)}`} /></div>;
    // Xử lý khi exercises đã fetch xong nhưng không có dữ liệu hoặc không có câu hỏi
    if (!exercises || !exercises.exerciseList || exercises.exerciseList.length === 0) {
        return <div className="exercises"><Error Title="Không tìm thấy dữ liệu bài tập hoặc bài tập không có câu hỏi." /></div>;
    }

    const answeredQuestionsCount = Object.keys(userAnswers).length;
    const totalQuestions = exercises.exerciseList.length;

    const recommendationPopupMessage = recommendationDetails
        ? `${recommendationDetails.message}. Bài học được đề xuất: ${recommendationDetails.ten_bai_hoc}.`
        : "";

    return (
        <div className="exercises">
            <div className="exercises__main-content">
                <Header
                    testName={exercises.name}
                    totalQuestions={totalQuestions}
                    duration={exercises.duration}
                    timeLeft={formatTime(timeLeft)}
                    answeredQuestionsCount={answeredQuestionsCount}
                    onSubmitTest={handleSubmitButtonPressed}
                    onCancelTest={handleCancelTestRequest}
                    isSubmitting={submitLoading}
                />
                <div className="exercises__content-wrapper">
                    <Body
                        questions={exercises.exerciseList}
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
                    title="Gợi ý bài học"
                    message={recommendationPopupMessage}
                />
            )}

            {submitLoading && <Loader text="Đang nộp bài..." />}
        </div>
    );
};

export default Exercises;