const BASE_URL = "http://localhost:8080/api/v1";

// Hàm đăng nhập bằng email/password
export const loginService = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await response.json(); // Lấy dữ liệu phản hồi bất kể thành công hay thất bại
  console.log("data", data);

  if (!response.ok) {
    // Trả về object chứa thông tin lỗi
    return {
      success: false,
      error: data.message || "Failed to login.",
      status: response.status,
      data: data, // Có thể bao gồm dữ liệu bổ sung từ server nếu có
    };
  }

  // Trả về object khi thành công
  return {
    success: true,
    data: data,
  };
};

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch("http://localhost:8080/api/v1/auth/account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};