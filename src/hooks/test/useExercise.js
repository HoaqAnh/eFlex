import { useEffect, useState } from "react"
import { getExercisesByTestId } from "../../services/exerciseService"
import { getRandomTestExerciseByCourseId } from "../../services/testService";

export const useExercise = (id, type) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const exercises = async () => {
            try {
                setError(null);

                let response;
                if (type === 'LevelAssessmentTest') {
                    response = await getRandomTestExerciseByCourseId(id);
                } else {
                    response = await getExercisesByTestId(id);
                }

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
    }, [id, type]);
    return { exercises, loading, error }
}