import { useEffect, useState } from "react"
import { getTotalLessonAndTest, getLessonDetails, getLessons } from "../../services/lessonService";

// Hook lấy thông tin tổng số lesson và test
export const useCountLessonAndTest = (courseId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [countLessonAndTest, setCountLessonAndTest] = useState(0);

    useEffect(() => {
        const getCount = async () => {
            try {
                setLoading(true);
                setError(null);

                const count = await getTotalLessonAndTest(courseId);

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

// Hook lấy thông tin chi tiết lesson (Tên bài, nội dung, ...)
export const useLessonDetail = (lessonId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lessonData, setLessonData] = useState();

    useEffect(() => {
        const getLessonDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getLessonDetails(lessonId);

                if (!data) {
                    setError('Không tìm thấy thông tin chi tiết bài học.');
                    return;
                }

                setLessonData(data);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setLoading(false);
            }
        }

        getLessonDetail();
    }, [lessonId]);

    return { loading, error, lessonData }
}

// Hook lấy danh sách lesson dựa trên course ID
export const useLessons = (courseId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listLesson, setListLesson] = useState([]);

    useEffect(() => {
        const getListLesson = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getLessons(courseId);

                if (!data) {
                    setError('Không tìm thấy thông tin danh sách bài học.');
                    return;
                }

                const sortedLessons = [...data].sort((a, b) => a.viTri - b.viTri);
                setListLesson(sortedLessons);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, Math.random() * 1000);
            }
        }

        getListLesson();
    }, [courseId]);

    return { loading, error, listLesson }
}