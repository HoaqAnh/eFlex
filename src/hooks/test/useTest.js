import { useEffect, useState } from "react";
import { getTests, submitTest } from "../../services/testService";

// Fetch list test
export const useTests = (lessonId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listTest, setListTest] = useState([]);

    useEffect(() => {
        const getListTest = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getTests(lessonId);

                if (!data) {
                    setError("Không tìm thấy danh sách bài kiểm");
                    return;
                }

                setListTest(data);
            } catch (err) {
                console.error(err);
                setError(err.message || "Có lỗi xảy khi lấy dữ liệu.");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, Math.random() * 1000);
            }
        }

        getListTest();
    }, [lessonId])
    return { loading, error, listTest }
}

// Submit Test
export const useSubmitTest = async (userId, testId, testData) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!userId || !testId || !testData) {
        setError('Không tìm thấy thông tin bắt buộc.');
        return;
    }

    try {
        setLoading(true);
        setError(null);

        const response = await submitTest(userId, testId, testData);

        if (!response.ok) {
            setError("Gửi kết quả bài kiểm tra thất bại.");
            return;
        }

        return await response.json();
    } catch (err) {
        console.err(err);
        setError(err.message || "Có lỗi trong quá trình gửi dữ liệu.");
    } finally {
        setTimeout(() => {
            setLoading(false);
        }, Math.random() * 1000);
    }

    return { loading, error }
}
