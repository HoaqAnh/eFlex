import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getCourseDetails } from "../../services/courseService";

export const useCourse = (courseId) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseDetail, setCourseDetail] = useState([]);

    const handleJoinCourse = useCallback((courseId) => {
        navigate(`/course/${courseId}`);
    }, [navigate]);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getCourseDetails(courseId);

                if (!data) {
                    setError('Không tìm thấy thông tin khóa học.');
                    return;
                }

                setCourseDetail(data);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setLoading(false);
            }
        }

        fetchCourseDetail();
    }, [courseId]);

    return {
        loading,
        error,
        courseDetail,
        handleJoinCourse
    }
}

export default useCourse;