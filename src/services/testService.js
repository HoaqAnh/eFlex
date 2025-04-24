const BASE_URL = "http://localhost:8080/api/v1";

export const createTest = async (testData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found, user is not authenticated");
        }

        const response = await fetch(`${BASE_URL}/test-exercises`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(testData),
            credentials: 'include',
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
        return { success: true, data: data.data };
    } catch (error) {
        console.error('Lỗi khi tạo bài kiểm tra:', error);
        return { success: false, error: error.message };
    }
};

export const uploadExerciseExcel = async (testId, file) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found, user is not authenticated");
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/exercise/excel/${testId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
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
        return { success: true, data: data.data };
    } catch (error) {
        console.error('Lỗi khi tải lên file Excel:', error);
        return { success: false, error: error.message };
    }
};

