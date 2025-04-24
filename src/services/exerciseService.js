const BASE_URL = "http://localhost:8080/api/v1";

export const getExercisesByLessonId = async (lessonId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, user is not authenticated");
            return [];
        }

        const response = await fetch(`${BASE_URL}/lesson/${lessonId}/exercises`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
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

export const uploadExerciseExcel = async (testId, file) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found, user is not authenticated");
        }
        console.log("testId: ", testId);
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

        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        return { 
            success: true, 
            data: responseData.data,
            message: responseData.message
        };
    } catch (error) {
        console.error('Lỗi khi tải lên file Excel:', error);
        return { success: false, error: error.message };
    }
};

