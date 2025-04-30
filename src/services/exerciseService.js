import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

export const getExercisesByLessonId = async (lessonId) => {
    try {
        const token = TokenService.getToken();
        if (!token) {
            console.error("Không tìm thấy token, người dùng chưa đăng nhập");
            return null;
        }

        // Kiểm tra token hợp lệ
        if (!TokenService.isTokenValid()) {
            console.error("Token không hợp lệ hoặc đã hết hạn");
            TokenService.clearTokens();
            return null;
        }

        const response = await fetch(`${BASE_URL}/lesson/${lessonId}/exercises`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                TokenService.clearTokens();
                throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            } else {
                throw new Error(`Error: ${response.status}. ${response.statusText}`);
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
        const token = TokenService.getToken();
        if (!token) {
            console.error("Không tìm thấy token, người dùng chưa đăng nhập");
            return null;
        }

        // Kiểm tra token hợp lệ
        if (!TokenService.isTokenValid()) {
            console.error("Token không hợp lệ hoặc đã hết hạn");
            TokenService.clearTokens();
            return null;
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
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                TokenService.clearTokens();
                throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            } else {
                throw new Error(`Error: ${response.status}. ${response.statusText}`);
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

