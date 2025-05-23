import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

export const progress = async (sectionId) => {
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

        const response = await fetch(`${BASE_URL}/progressSection`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                section: {
                    id: sectionId
                }
            }),
            credentials: 'include'
        });

        if (response.statusCode === 400) {
            console.log("Code: 400");
            return null;
        }

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                TokenService.clearTokens();
                throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            } else {
                throw new Error(`Error: ${response.status}. ${response.statusText}`);
            }
        }

        return response;
    } catch (error) {
        if (error.error.statusCode === 400) {
            console.log("Code: 400");
            return null;
        }
        console.error('API request error:', error);
        throw error;
    }
}

export const getSectionProgress = async (userId, sectionId) => {
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

        const response = await fetch(`${BASE_URL}/progressSectionCheck/${userId}/${sectionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            credentials: "include"
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
    } catch (err) {
        console.error('API request error:', err);
        throw err;
    }
}

export const getLessonProgress = async (userId, lessonId) => {
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

        const response = await fetch(`${BASE_URL}/progressLessonCheck/${userId}/${lessonId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            credentials: "include"
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
    } catch (err) {
        console.error('API request error:', err);
        throw err;
    }
}

export const getCourseStudying = async (userId) => {
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

        const response = await fetch(`${BASE_URL}/courses/studying/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            credentials: "include"
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
    } catch (err) {
        console.error('API request error:', err);
        throw err;
    }
}