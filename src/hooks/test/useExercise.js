import { useEffect, useState } from "react"
import { getExercisesByTestId } from "../../services/exerciseService"
import { getRandomTestExerciseByCourseId } from "../../services/testService";

export const useExercise = (testId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const exercises = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getExercisesByTestId(testId);
                if (!response) {
                    console.error("Không tìm thấy thông tin bài kiểm tra");
                    setError('Không tìm thấy thông tin bài kiểm tra');
                    return;
                }

                setExercises(response.data);
                return response;
            } catch (error) {
                console.error('Error:', error);
                setError(error.message || 'Có lỗi xảy ra khi lấy dữ liệu bài kiểm tra');
            } finally {
                setLoading(false);
            }
        }
        exercises();
    }, [testId])
    return { exercises, loading, error }
}

export const useLevelAssessmentTest = (courseId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [testExercise, setTestExercises] = useState([]);

    useEffect(() => {
        const testExercise = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getRandomTestExerciseByCourseId(courseId);
                if (!response) {
                    console.error("Không tìm thấy thông tin bài kiểm tra");
                    setError('Không tìm thấy thông tin bài kiểm tra');
                    return;
                }

                setTestExercises(response.data);
                return response;
            } catch (error) {
                console.error('Error:', error);
                setError(error.message || 'Có lỗi xảy ra khi lấy dữ liệu bài kiểm tra');
            } finally {
                setLoading(false);
            }
        }
        testExercise();
    }, [courseId])
    return { testExercise, loading, error }
}
