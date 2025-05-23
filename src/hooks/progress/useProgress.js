import { useEffect, useState } from "react";
import { progress, getSectionProgress, getLessonProgress, getCourseStudying } from "../../services/progressService"

export const useProgress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const sendSectionProgress = async (sectionId) => {
        if (!sectionId) {
            setError("Không tìm thấy ID section");
            throw new Error();
        }

        try {
            setLoading(true);
            setError(null);

            const result = await progress(sectionId);
            if (!result.ok) {
                throw new Error(result.error?.message || 'Lỗi không xác định từ API progress');
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Không thể gửi thông tin tiến độ. Vui lòng thử lại sau.');
            throw new Error();
        } finally {
            setLoading(false);
        }
    };

    return { sendSectionProgress, loading, error, success }
};

export const useGetProgress = (userId, entityId, entityType = "lesson") => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!userId || !entityId) {
            setIsCompleted(false);
            return;
        }

        const fetchProgressData = async () => {
            setLoading(true);
            setError(null);
            setIsCompleted(false);
            try {
                let result;
                if (entityType === "lesson") {
                    result = await getLessonProgress(userId, entityId);

                } else if (entityType === "section") {
                    result = await getSectionProgress(userId, entityId);
                } else {
                    console.warn("Loại thực thể không hợp lệ:", entityType);
                    setLoading(false);
                    return;
                }

                if (result && typeof result.data === 'boolean') {
                    setIsCompleted(result.data);
                } else {
                    console.warn(`Dữ liệu tiến độ không hợp lệ hoặc không tìm thấy cho ${entityType} ID: ${entityId}. Mặc định là false.`);
                    setIsCompleted(false);
                }

            } catch (err) {
                console.error(`Lỗi khi lấy tiến độ ${entityType} (ID: ${entityId}):`, err);
                setError(err.message || `Có lỗi xảy ra khi lấy thông tin tiến độ ${entityType}.`);
                setIsCompleted(false);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressData();
    }, [userId, entityId, entityType]);

    return {
        isEntityCompleted: isCompleted,
        isProgressLoading: loading,
        progressFetchError: error
    };
};

export const useGetCourseStudying = (userId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseStudying, setCourseStudying] = useState([]);

    useEffect(() => {
        if (!userId) {
            throw new Error('Không tìm thấy userId: ', userId);
        }

        const fetchCourseStudying = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await getCourseStudying(userId);
                if (!result) {
                    throw new Error(result.error?.message || 'Lỗi không xác định từ API getCourseStudying');
                }

                setCourseStudying(result.data);
            } catch (err) {
                setError(err.message || 'Không thể lấy thông tin bài đã học. Vui lòng thử lại sau.');
                throw new Error();
            } finally {
                setLoading(false);
            }
        };

        fetchCourseStudying();
    }, [userId])

    return { loading, error, courseStudying };
};