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




// cauHoi: exercises.data?.cauHoi ?? "",
// dapAn1: exercises.data?.dapAn1 ?? "",
// dapAn2: exercises.data?.dapAn2 ?? "",
// dapAn3: exercises.data?.dapAn3 ?? "",
// dapAn4: exercises.data?.dapAn4 ?? "",
// dapAnDung: exercises.data?.dapAnDung ?? null


// const message = error?.message || 'Không thể lấy thông tin khóa học. Vui lòng thử lại sau.';
// setError(message);

// if (message.includes("đăng nhập lại") && typeof navigate === 'function') {
//     localStorage.removeItem('token');
//     navigate('/login');
// }