import { useCallback, useState } from "react";
import { progress, getSectionProgress, getLessonProgress } from "../../services/progressService"

export const useProgress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sectionProgress, setSectionProgress] = useState(false);
    const [lessonProgress, setLessonProgress] = useState(false);

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
                throw result.error;
            }
            return null;
        } catch (err) {
            console.error('Lỗi khi gửi thông tin tiến độ:', err);
            setError(err.message || 'Không thể gửi thông tin tiến độ. Vui lòng thử lại sau.');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    const fetchSectionProgress = useCallback(async (userId, sectionId) => {
        if (!userId || !sectionId) {
            setError("Không tìm thấy ID User hoặc ID section");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getSectionProgress(userId, sectionId);
            if (!response || !response.data) {
                setError("Không tìm thấy thông tin tiến độ phần học");
                return;
            }

            setSectionProgress(response.data);
            return response.data;
        } catch (error) {
            console.log("Error: ", error);
            setError(error.message || "Có lỗi xảy ra khi lấy thông tin tiến độ");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLessonProgress = useCallback(async (userId, sectionId) => {
        if (!userId || !sectionId) {
            setError("Không tìm thấy ID User hoặc ID section");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getLessonProgress(userId, sectionId);
            if (!response || !response.data) {
                setError("Không tìm thấy thông tin tiến độ phần học");
                return;
            }

            setLessonProgress(response.data);
            return response.data;
        } catch (error) {
            console.log("Error: ", error);
            setError(error.message || "Có lỗi xảy ra khi lấy thông tin tiến độ");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        sendSectionProgress,
        fetchSectionProgress,
        fetchLessonProgress,
        sectionProgress,
        lessonProgress,
        error,
        loading
    }
}