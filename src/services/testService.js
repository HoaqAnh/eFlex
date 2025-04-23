const BASE_URL = "http://localhost:8080/api/v1";

export const createTest = async (testData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, user is not authenticated");
            return [];
        }

        const response = await fetch(`${BASE_URL}/test-exercises`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(testData),
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài tập:', error);
        throw error;
    }
};

