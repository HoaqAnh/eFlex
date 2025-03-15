import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import eFlexLogo from "../assets/images/logo_app.png";
import { loginService } from "../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Here you would add your authentication logic
    const response = await loginService(email, password);
    if (response.data.statusCode !== 200) {
      alert("Đăng nhập thất bại");
    } else {
      localStorage.setItem("token", response.data.data.access_token);
      navigate("/home");
    }
  };

  // Function to handle Google login
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Authentication logic here
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-header">
          <img src={eFlexLogo} alt="eFlex Logo" className="logo" />
          <h1>Rất vui được gặp bạn!</h1>
        </div>

        <div className="login-main">
          <div className="login-image">
            <img
              src={require("../assets/images/login-image.png")}
              alt="Login illustration"
            />
          </div>

          <div className="login-form-section">
            <p className="continue-text">Tiếp tục với</p>

            <button className="google-login-btn" onClick={handleGoogleLogin}>
              <img
                src={require("../assets/images/logo_google.png")}
                alt="Google"
              />
            </button>

            <div className="divider">
              <span>hoặc đăng nhập bằng gmail của bạn</span>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <div className="input-icon">
                  <img
                    src={require("../assets/icons/icon_mail.png")}
                    className="input-icon-img"
                    alt="Email"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <img
                    src={require("../assets/icons/icon_password.png")}
                    className="input-icon-img"
                    alt="Password"
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="forgot-password">
                <a href="#">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="login-btn">
                Đăng nhập
              </button>
            </form>

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