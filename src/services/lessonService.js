import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

// Hàm gọi API tạo lesson
export const lessonService = {
  async createLesson(lessonData) {
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

      const response = await fetch(`${BASE_URL}/lesson`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lessonData),
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
      console.error('Lỗi khi tạo bài học:', error);
      throw error;
    }
  },

  // Hàm gọi API tạo nhiều section cùng lúc
  async createSections(sectionsData) {
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

      const response = await fetch(`${BASE_URL}/Listsection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionsData),
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
      console.error('Lỗi khi tạo các phần học:', error);
      throw error;
    }
  },

  // Tạo lesson kèm các section
  async createLessonWithSections(lessonData, sectionForms) {
    try {
      const lessonPayload = {
        tenBai: lessonData.tenBai.trim(),
        course: {
          id: parseInt(lessonData.course.id)
        }
      };

      // Gọi API tạo lesson
      const lessonResponse = await this.createLesson(lessonPayload);

      // Lấy lessonId từ kết quả trả về
      const lessonId = lessonResponse.data.id;

      const sectionsData = sectionForms.map(form => ({
        tenBai: form.tenBai.trim(),
        moTa: form.moTa.trim(),
        lesson: {
          id: lessonId
        }
      }));

      // Gọi API tạo tất cả các section cùng lúc
      const sectionsResponse = await this.createSections(sectionsData);

      return {
        success: true,
        lessonData: lessonResponse,
        sectionsData: sectionsResponse
      };
    } catch (error) {
      console.error('Lỗi khi thêm bài học và các phần học:', error);
      return {
        success: false,
        error
      };
    }
  },

  // Hàm tải lên file Excel cho bài tập trắc nghiệm
  async uploadExerciseExcel(lessonId, file) {
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

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BASE_URL}/exercise/excel/${lessonId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
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

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi tải lên file Excel bài tập:', error);
      throw error;
    }
  }
};

// Fetch tổng số bài học và bài kiểm tra
export const getTotalLessonAndTest = async (courseId) => {
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

    const response = await fetch(`${BASE_URL}/course/count/${courseId}`, {
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

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng bài học:', error);
    return { baiHoc: 0, baiTap: 0 };
  }
};

// Fetch danh sách lesson dựa trên course ID
export const getLessons = async (courseId) => {
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

    const response = await fetch(`${BASE_URL}/lesson/${courseId}`, {
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

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài học:', error);
    throw error;
  }
};

// Fetch danh sách section dựa trên lesson ID
export const getSections = async (lessonId) => {
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

    const response = await fetch(`${BASE_URL}/${lessonId}/Listsection`, {
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

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phần học:', error);
    throw error;
  }
};

// Fetch Chi tiết bài học (Tên bài, mô tả, ...) dựa trên lesson ID
export const getLessonDetails = async (lessonId) => {
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

    const response = await fetch(`${BASE_URL}/lesson/${lessonId}`, {
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

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin bài học:', error);
    throw error;
  }
};