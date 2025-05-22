import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

export const getCourseDetails = async (courseId) => {
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

    const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
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

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khóa học:', error);
    throw error;
  }
};

export const CourseApi = {
  uploadCourseImage: async (imageFile) => {
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

      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);

      const response = await fetch(`${BASE_URL}/upload/course-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: imageFormData,
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

      const data = await response.json();

      // Xử lý URL hình ảnh
      const imageUrlWithTimestamp = data.data.imageUrl;
      return removeTimestampFromUrl(imageUrlWithTimestamp);
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  },

  // Thêm khóa học mới
  addCourse: async (courseData, imageUrl) => {
    return await sendCourseRequest(courseData, imageUrl, 'courses');
  },

  // Lưu khóa học nháp
  saveCourseAsDraft: async (courseData, imageUrl) => {
    return await sendCourseRequest(courseData, imageUrl, 'coursesDraft');
  }
};

// Helper function để gửi request tạo khóa học
const sendCourseRequest = async (courseData, imageUrl, endpoint) => {
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

    const payload = {
      tenMon: courseData.tenMon.trim(),
      moTa: courseData.moTa.trim(),
      anhMonHoc: imageUrl,
      category: {
        id: parseInt(courseData.category)
      }
    };

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
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

// Hàm loại bỏ timestamp khỏi URL
const removeTimestampFromUrl = (url) => {
  return url.replace(/(\.\w+)_\d+$/, '$1');
};

//Hàm xóa khóa học
export const deleteCourse = async (courseId) => {
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

    const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
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
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Hàm lấy danh sách khóa học
export const fetchCourses = async (paginationParams = { page: 0, size: 10 }) => {
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

    const url = `${BASE_URL}/courses?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

    if (responseData.data.meta && Array.isArray(responseData.data.result.content)) {
      return responseData.data;
    } else {
      throw new Error("Cấu trúc dữ liệu không đúng định dạng");
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
