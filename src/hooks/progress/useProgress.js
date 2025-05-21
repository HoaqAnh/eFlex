import { useEffect, useState } from "react";
import { progress, getSectionProgress, getLessonProgress } from "../../services/progressService"
import toast from "react-hot-toast";

export const useProgress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendSectionProgress = async (sectionId) => {
        if (!sectionId) {
            setError("Không tìm thấy ID section");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await progress(sectionId);
            if (!result.ok) {
                throw new Error(result.error?.message || 'Lỗi không xác định từ API progress');
            }
            toast.success('Cập nhật tiến độ học tập thành công.')
            return;
        } catch (err) {
            toast.error('Tiến độ của bạn chưa được lưu, vui lòng thử lại.')
            setError(err.message || 'Không thể gửi thông tin tiến độ. Vui lòng thử lại sau.');
            return;
        } finally {
            setLoading(false);
        }
    };

    return { sendSectionProgress, loading, error }
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
                let responseData;
                if (entityType === "lesson") {
                    responseData = await getLessonProgress(userId, entityId);
                    
                } else if (entityType === "section") {
                    responseData = await getSectionProgress(userId, entityId);
                } else {
                    console.warn("Loại thực thể không hợp lệ:", entityType);
                    setLoading(false);
                    return;
                }

                if (responseData && typeof responseData.data === 'boolean') {
                    setIsCompleted(responseData.data);
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