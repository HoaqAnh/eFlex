import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';
import TokenService from "../../services/tokenService";
import { getCurrentUser } from "../../services/authService";

//style
import "../../styles/authentication/google-login.css";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticateWithGoogle = async () => {
      try {
        // setIsLoading(true);
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");

        if (!code) {
          throw new Error("Không tìm thấy mã xác thực Google");
        }

        const response = await fetch(
          "http://localhost:8080/api/v1/login/oauth2/code/google?code=" +
          encodeURIComponent(code)
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.data?.error || "Đăng nhập thất bại");
        }

        const responseData = await response.json();
        const accessToken = responseData.data.access_token;
        const refreshToken = responseData.data.refresh_token;

        if (accessToken) {
          TokenService.setToken(accessToken);
        }
        if (refreshToken) {
          TokenService.setRefreshToken(refreshToken);
        }

        // Lấy thông tin người dùng
        const userData = await getCurrentUser();
        if (!userData || !userData.data) {
          throw new Error("Không thể lấy thông tin người dùng");
        }

        // Điều hướng dựa trên role
        const roleName = userData.data.roleName;
        if (roleName === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

        toast.success("Đăng nhập thành công!");
      } catch (err) {
        console.error("Google login error:", err);
        setError(err.message || "Đã có lỗi xảy ra trong quá trình xác thực");
        TokenService.clearTokens();
        toast.error(err.message || "Đăng nhập thất bại");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
      // } finally {
      //   setIsLoading(false);
      // }
    };

    authenticateWithGoogle();
  }, [navigate, location]);

  return (
    <div className="google-login-container">
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <p>Đang chuyển hướng về trang đăng nhập...</p>
        </div>
      ) : (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang xử lý đăng nhập...</p>
        </div>
      )}
    </div>
  );
}

export default GoogleLogin;