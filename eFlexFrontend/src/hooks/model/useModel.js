import { useCallback, useState } from "react";
import { getCourseRecommend } from "../../services/modelService"

export const useModel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recommendData, setRecommendData] = useState([]);

    const courses = useCallback(async (userId) => {
        if (!userId) {
            setError("Không tìm thấy ID User");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getCourseRecommend(userId);
            if (!response || !response.data) {
                setError("Không tìm thấy thông tin đề xuất khóa học");
                return;
            }

            setRecommendData(response.data);
            return response.data;
        } catch (error) {
            console.log("Error: ", error);
            setError(error.message || "Có lỗi xảy ra khi lấy dữ liệu đề xuất");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, Math.random() * 1000);
        }
    }, []);

    return {
        courses,
        recommendData,
        error,
        loading
    }
}