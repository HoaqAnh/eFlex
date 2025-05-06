import { useCallback, useState } from "react"
import { getExercisesByTestId } from "../../services/exerciseService"

export const useExercise = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exerciseData, setExerciseData] = useState([]);

    const exercises = useCallback(async (testId) => {
        if (!testId) {
            setError('Không tìm thấy ID bài kiểm tra');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getExercisesByTestId(testId);
            if (!response || !response.data) {
                setError('Không tìm thấy thông tin bài kiểm tra');
                return;
            }
            
            setExerciseData(response.data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Có lỗi xảy ra khi lấy dữ liệu bài kiểm tra');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        exercises,
        exerciseData,
        loading,
        error
    }
}