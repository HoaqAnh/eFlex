const BASE_URL = "http://localhost:8080/api/v1";

export const getCourseDetails = async (courseId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated");
      return null;
    }

    const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch course details: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khóa học:', error);
    throw error;
  }
};

export const CourseApi = {
  // Upload hình ảnh khóa học
  uploadCourseImage: async (imageFile) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Không tìm thấy token xác thực");

      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);

      const response = await fetch(`${BASE_URL}/upload/course-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: imageFormData
      });

      if (!response.ok) throw new Error('Lỗi upload hình ảnh');

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

// Helper function để gửi request tạo/cập nhật khóa học
const sendCourseRequest = async (courseData, imageUrl, endpoint) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Không tìm thấy token xác thực");

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
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
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
