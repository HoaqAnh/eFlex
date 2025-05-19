import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

export const filterService = async (paginationParams = { page: 0, size: 10, sort: 'id,asc' }, idCategory) => {
    try {
        const token = TokenService.getToken();
        if (!token) {
            console.error("Không tìm thấy token, người dùng chưa đăng nhập");
            return null;
        }

        if (!TokenService.isTokenValid()) {
            console.error("Token không hợp lệ hoặc đã hết hạn");
            TokenService.clearTokens();
            return null;
        }

        const queryParams = new URLSearchParams();
        if (paginationParams.page !== undefined) {
            queryParams.append('page', paginationParams.page);
        }
        if (paginationParams.size !== undefined) {
            queryParams.append('size', paginationParams.size);
        }
        if (paginationParams.sort) {
            if (Array.isArray(paginationParams.sort)) {
                paginationParams.sort.forEach(s => queryParams.append('sort', s));
            } else {
                queryParams.append('sort', paginationParams.sort);
            }
        }
        const url = `${BASE_URL}/courses/filter/${idCategory}?${queryParams.toString()}`;

        const response = await fetch(`${BASE_URL}/courses/filter/${idCategory}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
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
        const responseData = await response.json();
        return responseData.data.result.content;
    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu phân trang:', error);
        return { success: false, error: error.message };
    }
}; 