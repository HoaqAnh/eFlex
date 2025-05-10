import { useEffect, useState } from "react"
import { getCourseLessonCount } from "../../services/lessonService";
export const useLesson = (courseId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [countLessonAndTest, setCountLessonAndTest] = useState(0);

    useEffect(() => {
        const getCount = async () => {
            try {
                setLoading(true);
                setError(null);

                const count = await getCourseLessonCount(courseId);

                if (!count) {
                    setError('Không tìm thấy thông tin số lượng bài học và bài tập.');
                    return;
                }

                setCountLessonAndTest(count);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setLoading(false);
            }
        }

        getCount();
    }, [courseId]);

    return { loading, error, countLessonAndTest }
}

export default useLesson;