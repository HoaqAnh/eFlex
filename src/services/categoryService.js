import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

export const getAllCategory = async () => {
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

        const response = await fetch(`${BASE_URL}/Category`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
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


        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy thông tin danh mục:', error);
        throw error;
    }
};