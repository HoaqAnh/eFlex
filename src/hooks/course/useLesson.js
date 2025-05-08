import { useCallback, useState } from "react"
import { getCourseLessonCount } from "../../services/lessonService";
export const useLesson = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCountData = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(false);

            const response = await getCourseLessonCount(courseId);

            if (!response) {
                setError('Không tìm thấy thông tin khóa học.');
                return;
            }

            return response;
        } catch (err) {
            console.error(err);
            setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
        } finally {
            setLoading(false);
        }
    }, [])
    return {
        loading,
        error,
        fetchCountData
    }
}