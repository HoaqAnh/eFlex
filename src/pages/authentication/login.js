import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/authService";

//components
import LogoHeader from "../../components/auth/LogoHeader";
import LoginImage from "../../components/auth/LoginImage";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import LoginForm from "../../components/auth/LoginForm";

//style
import "../../styles/authentication/login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await loginService(email, password);
    if (response.data.statusCode !== 200) {
      alert("Đăng nhập thất bại");
    } else {
      localStorage.setItem("token", response.data.data.access_token);

      if (response.data.data.userLogin.role.roleName === "admin") {
        navigate("/dashboard");
      } else if (
        response.data.data.userLogin.role.roleName === "user" ||
        null
      ) {
        navigate("/home");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <LogoHeader />

        <div className="login-main">
          <LoginImage />

          <div className="login-form-section">
            <p className="continue-text">Tiếp tục với</p>

            <GoogleLoginButton />

            <div className="divider">
              <span>hoặc đăng nhập bằng gmail của bạn</span>
            </div>

            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={handleLogin}
            />

            <p className="register-prompt">
              Bạn chưa có tài khoản? <a href="#">Đăng ký</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;