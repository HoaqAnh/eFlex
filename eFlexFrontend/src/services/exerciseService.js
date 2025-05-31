import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

// Function remove timestamp for URL
const removeTimestampFromUrl = (url) => {
    return url.replace(/(\.\w+)_\d+$/, '$1');
};

// Fetch Exercises details by test ID
export const getExercisesByTestId = async (testId) => {
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

        const response = await fetch(`${BASE_URL}/lesson/${testId}/exercises`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Upload file excel for multiple choice
export const uploadExerciseExcel = async (testId, file) => {
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

// Upload file audio for listening exercise test
export const uploadListeningAudio = async (audioFile) => {
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

        const audioFormData = new FormData();
        audioFormData.append('file', audioFile);

        const response = await fetch(`${BASE_URL}/upload/listening-audio`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: audioFormData,
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

        const res = await response.json();
        const videoUrlWithTimestamp = res.data.videoUrl;
        return removeTimestampFromUrl(videoUrlWithTimestamp);
    } catch (err) {
        console.error('Upload video error:', err);
        throw err;
    }
}

// Upload file excel for listening exercise test
export const uploadListeningExcel = async (idParams = { id_TestExercise: 0, id_Listening: 0 }, file) => {
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

        if (idParams.id_TestExercise !== undefined) {
            queryParams.append('id_TestExercise', idParams.id_TestExercise);
        } else {
            throw new Error("id_TestExercise not found!");
        }

        if (idParams.id_Listening !== undefined) {
            queryParams.append('id_Listening', idParams.id_Listening);
        } else {
            throw new Error("id_Listening not found!");
        }

        const formData = new FormData();
        formData.append('file', file);

        const url = `${BASE_URL}/exercise/excel?${queryParams.toString()}`

        const response = await fetch(url, {
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

// Upload file excel for reading exercise test
export const uploadReadingExcel = async (idParams = { id_TestExercise: 0, id_readingPassage: 0 }, file) => {
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

        if (idParams.id_TestExercise !== undefined) {
            queryParams.append('id_TestExercise', idParams.id_TestExercise);
        } else {
            throw new Error("id_TestExercise not found!");
        }

        if (idParams.id_readingPassage !== undefined) {
            queryParams.append('id_readingPassage', idParams.id_readingPassage);
        } else {
            throw new Error("id_readingPassage not found!");
        }

        const formData = new FormData();
        formData.append('file', file);

        const url = `${BASE_URL}/exercise/excel/reading?${queryParams.toString()}`

        const response = await fetch(url, {
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