import { useCallback, useState } from "react"
import { fetchCourses } from "../../services/courseService";
export const useCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCourse = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);

            const response = await fetchCourses();

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
        fetchCourse
    }
}