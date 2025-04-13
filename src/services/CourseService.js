const BASE_URL = "http://localhost:8080/api/v1";

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

/*
export const getAllCourse = async (page = 0, size = 10) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(
      `${BASE_URL}/courses?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    return null;
  }
};

export const getCourse = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated");
      return null;
    }

    const response = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Course not found");
      } else if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired token");
      } else {
        throw new Error(`Failed to fetch course: ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching course:", error.message);
    return null;
  }
};
*/
