const BASE_URL = "http://localhost:8080/api/v1";

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