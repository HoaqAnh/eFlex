const BASE_URL = "http://localhost:8080/api/v1";

export const lessonService = {
  // Hàm gọi API tạo lesson
  async createLesson(lessonData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
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
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
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
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
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
      // Chuẩn bị dữ liệu lesson
      const lessonPayload = {
        tenBai: lessonData.tenBai.trim(),
        course: {
          id: parseInt(lessonData.course.id)
        }
      };
      
      // Gọi API tạo lesson
      const lessonResponse = await this.createLesson(lessonPayload);
      console.log("Bài học đã được thêm thành công:", lessonResponse);
      
      // Lấy lessonId từ kết quả trả về
      const lessonId = lessonResponse.data.id;
      console.log("lessonId:", lessonId);

      // Chuẩn bị dữ liệu các section
      const sectionsData = sectionForms.map(form => ({
        tenBai: form.tenBai.trim(),
        moTa: form.moTa.trim(),
        lesson: {
          id: lessonId
        }
      }));

      // Gọi API tạo tất cả các section cùng lúc
      const sectionsResponse = await this.createSections(sectionsData);
      console.log("Các phần học đã được thêm thành công:", sectionsResponse);

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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
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
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Lỗi khi tải lên file Excel bài tập:', error);
      throw error;
    }
  }
};

export const getCourseLessonCount = async (courseId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated");
      return { baiHoc: 0, baiTap: 0 };
    }

    const response = await fetch(`${BASE_URL}/course/count/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson count: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng bài học:', error);
    return { baiHoc: 0, baiTap: 0 };
  }
};

export const getCourseLessons = async (courseId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated");
      return [];
    }

    const response = await fetch(`${BASE_URL}/lesson/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài học:', error);
    throw error;
  }
};

export const getLessonSections = async (lessonId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated");
      return [];
    }

    const response = await fetch(`${BASE_URL}/${lessonId}/Listsection`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phần học:', error);
    throw error;
  }
};

export const getLessonDetails = async (lessonId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, user is not authenticated");
            return null;
        }

        const response = await fetch(`${BASE_URL}/GetLesson/${lessonId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch lesson details: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin bài học:', error);
        throw error;
    }
};