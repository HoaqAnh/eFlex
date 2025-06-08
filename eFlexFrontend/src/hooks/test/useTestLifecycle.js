import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
    getStoredEndTime, storeEndTime, clearStoredEndTime,
    getTestAbandonedFlag, setTestAbandonedFlag, clearTestAbandonedFlag
} from '../../components/users/test/testStorage';

export const useTestLifecycle = (exercises, initialTestId) => {
    const location = useLocation();
    const { id: courseIdParam, lessonId: lessonIdParam, testId: testIdParam } = useParams();

    const testId = initialTestId || testIdParam;

    const [timeLeft, setTimeLeft] = useState(null);
    const [isAbandonedConfirmPopupOpen, setIsAbandonedConfirmPopupOpen] = useState(false);
    const [testInstanceKey, setTestInstanceKey] = useState(Date.now());
    const prevLocationPathRef = useRef(location.pathname);

    // Effect 1: Khởi tạo timeLeft và userAnswers DỰA TRÊN exercises và localStorage
    useEffect(() => {
        if (exercises && testId) {
            const isAbandoned = getTestAbandonedFlag(testId);
            const storedEndTime = getStoredEndTime(testId);
            const now = Date.now();

            // 1. Bị bỏ dở, còn hạn, còn thời gian -> hiển thị popup
            if (isAbandoned && storedEndTime && storedEndTime > now) {
                setIsAbandonedConfirmPopupOpen(true);
                return;
            }

            if (isAbandoned) {
                clearTestAbandonedFlag(testId);
            }

            // 2. Không bị bỏ dở (hoặc đã xử lý), còn hạn, còn thời gian -> Tiếp tục
            if (storedEndTime && storedEndTime > now) {
                const remainingSeconds = Math.max(0, Math.floor((storedEndTime - now) / 1000));
                setTimeLeft(remainingSeconds);
            } else {
                // 3. Hết hạn hoặc bắt đầu mới
                if (storedEndTime && storedEndTime <= now) {
                    clearStoredEndTime(testId);
                }
                if (exercises && exercises.duration > 0) {
                    const durationInSeconds = exercises.duration * 60;
                    const newEndTime = now + durationInSeconds * 1000;
                    storeEndTime(testId, newEndTime);
                    setTimeLeft(durationInSeconds);
                }
            }
        }
    }, [exercises, testId, testInstanceKey]);

    // Effect 2: Quản lý Timer
    useEffect(() => {
        // Điều kiện 1: Nếu timeLeft chưa được khởi tạo (vẫn là null), không làm gì cả.
        if (timeLeft === null) {
            return;
        }

        // Điều kiện 2: Nếu thời gian vẫn còn (timeLeft > 0) VÀ CÓ exercises, bắt đầu đếm ngược
        if (exercises) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft, exercises]);

    // Effect 3 để phát hiện rời khỏi trang bài thi
    useEffect(() => {
        const currentPathWhenEffectRuns = location.pathname;
        const currentTestUrl = `/course/${courseIdParam}/lesson/${lessonIdParam}/test/${testIdParam}`;

        const previousPath = prevLocationPathRef.current;
        if (previousPath === currentTestUrl && currentPathWhenEffectRuns !== currentTestUrl) {
            if (getStoredEndTime(testIdParam)) setTestAbandonedFlag(testIdParam);
        }

        prevLocationPathRef.current = currentPathWhenEffectRuns;

        return () => {
            const pathBeforeUnmount = prevLocationPathRef.current;
            if (pathBeforeUnmount === currentTestUrl) {
                if (getStoredEndTime(testIdParam)) setTestAbandonedFlag(testIdParam);
            }
        };
    }, [location.pathname, courseIdParam, lessonIdParam, testIdParam]);

    // Khi người dùng chọn "Làm lại bài" từ popup bỏ dở
    const handleRestartAbandonedTest = useCallback(() => {
        clearTestAbandonedFlag(testId);
        clearStoredEndTime(testId);
        setIsAbandonedConfirmPopupOpen(false);
        setTestInstanceKey(Date.now());
    }, [testId]);

    return {
        timeLeft,
        setTimeLeft,
        isAbandonedConfirmPopupOpen,
        setIsAbandonedConfirmPopupOpen,
        handleRestartAbandonedTest
    };
};

export default useTestLifecycle;