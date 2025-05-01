import TokenService from './tokenService';

const BASE_URL = "http://localhost:8080/api/v1";

// Hàm đăng ký bằng email/password
export const registerService = async (fullname, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        fullname,
        role: {
          id: 2
        }
      }),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Email đã tồn tại hoặc thông tin không hợp lệ");
      } else {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Hàm đăng nhập bằng email/password
export const loginService = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Email hoặc mật khẩu không chính xác");
      } else if (response.status === 403) {
        throw new Error("Tài khoản của bạn đã bị khóa");
      } else {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
      }
    }

    const responseData = await response.json();
    const access_token = responseData.data.access_token;
    const refresh_token = responseData.data.refresh_token;

    if (access_token) TokenService.setToken(access_token);
    if (refresh_token) TokenService.setRefreshToken(refresh_token);

    return responseData;
  } catch (error) {
    throw error;
  }
};

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
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

    const response = await fetch(`${BASE_URL}/auth/account`, {
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

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

// Hàm refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = TokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error("Không tìm thấy refresh token");
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: "include",
    });

    if (!response.ok) {
      TokenService.clearTokens();
      throw new Error("Không thể refresh token");
    }

    const responseData = await response.json();

    // Lưu token mới
    if (responseData.access_token) {
      TokenService.setToken(responseData.access_token);
    }
    if (responseData.refresh_token) {
      TokenService.setRefreshToken(responseData.refresh_token);
    }

    return responseData;
  } catch (error) {
    console.error("Lỗi refresh token:", error);
    throw error;
  }
};

export const logoutService = async () => {
  try {
    const token = TokenService.getToken();
    if (!token) {
      console.error("Không tìm thấy token, người dùng chưa đăng nhập");
      return null;
    }

    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
    }

    // Xóa token sử dụng TokenService
    TokenService.clearTokens();
    return true;
  } catch (error) {
    throw error;
  }
};