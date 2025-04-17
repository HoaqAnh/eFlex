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

  // Hàm gọi API tạo section
  async createSection(sectionData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      }

      const response = await fetch(`${BASE_URL}/section`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData),
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
      console.error('Lỗi khi tạo phần học:', error);
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

      // Gọi API tạo các section
      const sectionPromises = sectionsData.map(sectionData => this.createSection(sectionData));
      const sectionResults = await Promise.all(sectionPromises);
      console.log("Các phần học đã được thêm thành công:", sectionResults);

      return { 
        success: true, 
        lessonData: lessonResponse, 
        sectionsData: sectionResults 
      };
    } catch (error) {
      console.error('Lỗi khi thêm bài học và các phần học:', error);
      return { 
        success: false, 
        error 
      };
    }
  }
};