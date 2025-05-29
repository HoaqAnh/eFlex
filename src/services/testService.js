import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

// Create Test
export const creTest = async (testData) => {
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

        const response = await fetch(`${BASE_URL}/test-exercises`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(testData),
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

        const data = await response.json();
        return { success: true, data: data.data };
    } catch (error) {
        console.error('Lỗi khi tạo bài kiểm tra:', error);
        return { success: false, error: error.message };
    }
};

// Fetch list Test
export const getTests = async (lessonId) => {
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

        const response = await fetch(`${BASE_URL}/test-exercises/lesson/${lessonId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
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
        console.error('API request error:', error);
        throw error;
    }
};

// Submit Test
export const submitTest = async (userId, testId, testData) => {
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

        const response = await fetch(`${BASE_URL}/submit-test/${userId}/${testId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(testData),
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
        console.error('API request error:', error);
        throw error;
    }
};

// Fetch Random exercise by course ID
export const getRandomTestExerciseByCourseId = async (courseId) => {
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

        const response = await fetch(`${BASE_URL}/test-exercises/assessmentTest/${courseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
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

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Create listening test | Payload: "groupName": "string", "audioFile": "string"
export const creListeningTest = async (testData) => {
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

        const response = await fetch(`${BASE_URL}/listeningGroup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(testData),
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

        const data = await response.json();
        return { success: true, data: data.data };
    } catch (error) {
        console.error('Lỗi khi tạo bài kiểm tra:', error);
        return { success: false, error: error.message };
    }
};

// Create reading passage | Payload: "title": "string", "content": "string"
export const creReadingTest = async (testData) => {
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

        const response = await fetch(`${BASE_URL}/readingPassage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(testData),
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

        const data = await response.json();
        return { success: true, data: data.data };
    } catch (error) {
        console.error('Lỗi khi tạo bài kiểm tra:', error);
        return { success: false, error: error.message };
    }
};