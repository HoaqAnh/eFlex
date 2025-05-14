import { useEffect, useState } from "react"
import { getExercisesByTestId } from "../../services/exerciseService"

export const useExercise = (testId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exerciseData, setExerciseData] = useState([]);

    useEffect(() => {
        const exercises = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getExercisesByTestId(testId);
                if (!response || !response.data) {
                    setError('Không tìm thấy thông tin bài kiểm tra');
                    return;
                }

                setExerciseData(response);
                return response;
            } catch (error) {
                console.error('Error:', error);
                setError(error.message || 'Có lỗi xảy ra khi lấy dữ liệu bài kiểm tra');
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, Math.random() * 1000);
            }
        }

        exercises();
    }, [testId])

    return { exerciseData, loading, error }
}