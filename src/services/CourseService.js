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
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
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

//Hàm xóa khóa học
export const deleteCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Không tìm thấy token xác thực");

    const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Lỗi xóa khóa học: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Hàm lấy danh sách khóa học
export const fetchCourses = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }

    const response = await fetch(`${BASE_URL}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
      }
    }

    const responseData = await response.json();

    if (responseData.data &&
      responseData.data.result &&
      Array.isArray(responseData.data.result.content)) {

      const coursesData = responseData.data.result.content;
      const pagination = responseData.data.meta ? {
        page: responseData.data.meta.page,
        pageSize: responseData.data.meta.pageSize,
        total: responseData.data.meta.total,
        pages: responseData.data.meta.pages
      } : responseData.data.result.page ? {
        page: responseData.data.result.page.number + 1,
        pageSize: responseData.data.result.page.size,
        total: responseData.data.result.page.totalElements,
        pages: responseData.data.result.page.totalPages
      } : null;

      const formattedCourses = coursesData.map(course => ({
        id: course.id,
        title: course.tenMon,
        image: course.anhMonHoc,
        description: course.moTa,
        status: course.statusCourse,
        createdAt: course.ngayTao,
        updatedAt: course.ngayCapNhat,
        createdBy: course.createdBy,
        updatedBy: course.updatedBy,
        category: course.category
      }));

      return {
        courses: formattedCourses,
        pagination
      };
    } else {
      throw new Error("Cấu trúc dữ liệu không đúng định dạng");
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
