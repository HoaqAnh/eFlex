import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//style
import "../../styles/authentication/google-login.css";

function GoogleLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticateWithGoogle = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");

        if (!code) {
          throw new Error("Không tìm thấy mã xác thực Google");
        }

        const response = await fetch(
          "http://localhost:8080/api/v1/login/oauth2/code/google?code=" +
          encodeURIComponent(code)
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.data.error);
        }
        const accessToken = data.data.access_token;
        localStorage.setItem("token", accessToken);
        navigate("/home");
      } catch (err) {
        setError(err.message || "Đã có lỗi xảy ra trong quá trình xác thực");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
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