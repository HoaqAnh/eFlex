import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../../services/courseService";
export const useCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCourse = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

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

    const handleJoinCourse = useCallback((courseId) => {
        navigate(`/course/${courseId}`);
    }, [navigate]);

    return {
        loading,
        error,
        fetchCourse,
        handleJoinCourse
    }
}