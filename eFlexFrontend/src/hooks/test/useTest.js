import { useState, useEffect } from "react";
import { getTests, submitTest as submitTestService } from "../../services/testService";

// Fetch list test
export const useTests = (lessonId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listTest, setListTest] = useState([]);

    useEffect(() => {
        const getListTest = async () => {
            if (!lessonId) {
                setListTest([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const result = await getTests(lessonId);

                if (!result || !result.data) {
                    setError("Không tìm thấy danh sách bài kiểm tra.");
                    setListTest([]);
                } else {
                    setListTest(result.data);
                }
            } catch (err) {
                console.error(err);
                setError(err.message || "Có lỗi xảy khi lấy dữ liệu.");
                setListTest([]);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            }
        }
        getListTest();
    }, [lessonId]);
    return { loading, error, listTest };
};

// Submit Test Hook
export const useSubmitTest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeSubmit = async (userId, answers) => {
        if (!userId || !answers) {
            const errMsg = 'Thông tin userId hoặc answers không được để trống khi nộp bài.';
            console.error(errMsg);
            setError(errMsg);
            return { statusCode: 400, message: errMsg, data: null };
        }

        try {
            setLoading(true);
            setError(null);
            setLoading(false);
            return await submitTestService(userId, answers);
        } catch (err) {
            setError(err.message || "Có lỗi trong quá trình gửi dữ liệu.");
            setLoading(false);
            return { statusCode: err.statusCode || 500, message: err.message || "Có lỗi trong quá trình gửi dữ liệu.", data: null };
        }
    };

    return { executeSubmit, loading, error };
};