import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import eFlexLogo from "../assets/images/logo_app.png";
import { loginService } from "../services/authService";
import { useGoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:3000/login/google',
    scope: 'email profile',
    response_type: 'code',
    onError: errorResponse => {
      console.error('Google Login Failed:', errorResponse);
    }
  });

  // // User loginlogin
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   const response = await loginService(email, password);
  //   if (response.data.statusCode !== 200) {
  //     alert("Đăng nhập thất bại");
  //   } else {
  //     localStorage.setItem("token", response.data.data.access_token);
  //     navigate("/home");
  //   }
  // };

  // Admin login
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await loginService(email, password);
    if (response.data.statusCode !== 200) {
      alert("Đăng nhập thất bại");
    } else {
      localStorage.setItem("token", response.data.data.access_token);
      // localStorage.setItem("role", response.data.data.role);
      navigate("/homePanel");
    }
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

            <button className="google-login-btn" onClick={login}>
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
                    className="loginPage_input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
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
                    className="loginPage_input"
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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