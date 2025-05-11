import { useEffect, useState } from "react"
import { getCourseLessonCount, getLessonDetails } from "../../services/lessonService";

export const useCountLessonAndTest = (courseId) => {
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

export const useLessonDetail = (courseId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listLesson, setListLesson] = useState([]);

    useEffect(() => {
        const getLessonDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getLessonDetails(courseId)

                if (!data) {
                    setError('Không tìm thấy thông tin chi tiết bài học.');
                    return;
                }

                const sortedLessons = [...data].sort((a, b) => a.viTri - b.viTri);
                setListLesson(sortedLessons);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setLoading(false);
            }
        }

        getLessonDetail();
    }, [courseId]);

    return { loading, error, listLesson }
}

