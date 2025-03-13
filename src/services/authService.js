// Configure your Google OAuth details
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Thay bằng Google Client ID của bạn
const BASE_URL = "http://localhost:8080/api/v1"; // Có thể thay đổi tùy theo backend của bạn

// Hàm cấu hình Google Auth
export const configureGoogleAuth = () => {
  // Load Google API script
  const loadGoogleScript = () => {
    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  };

  // Khởi tạo Google Sign-In
  const initializeGoogleSignIn = () => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
      });
    });
  };

  loadGoogleScript();
};

// Hàm đăng nhập bằng username/password
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await response.json(); // Lấy dữ liệu phản hồi bất kể thành công hay thất bại

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

// Hàm đăng nhập bằng Google
export const signInWithGoogle = async () => {
  try {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (!auth2) throw new Error("Google Auth chưa được khởi tạo.");

    const googleUser = await auth2.signIn();
    const profile = googleUser.getBasicProfile();
    const token = googleUser.getAuthResponse().id_token;

    const userData = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
      token,
    };

    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Lỗi khi đăng nhập bằng Google:", error);
    throw error;
  }
};

// Hàm đăng xuất
export const signOut = async () => {
  try {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2) await auth2.signOut();
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    throw error;
  }
};

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};
