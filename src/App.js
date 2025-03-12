import React from "react";
import "./styles/App.css";
import logo from "./assets/images/logo.png";

function App() {
  return (
    <div className="app">
      <div className="login-card">
        <div className="header">
          <div className="logo">
            <div className="logo-icon">
              <img src={logo} alt="logo" />
            </div>
          </div>
          <h1 className="greeting">Rất vui được gặp bạn!</h1>
        </div>

        <div className="content">
          <div className="circles-image"></div>

          <div className="login-form">
            <p className="continue-text">Tiếp tục với</p>

            <button className="google-button">
              <span className="google-icon"></span>
            </button>

            <p className="or-text">hoặc đăng nhập bằng gmail của bạn</p>

            <div className="input-container">
              <div className="input-with-icon">
                <span className="email-icon"></span>
                <input type="email" placeholder="Email" />
              </div>
            </div>

            <div className="input-container">
              <div className="input-with-icon">
                <span className="password-icon"></span>
                <input type="password" placeholder="Mật khẩu" />
              </div>
            </div>

            <div className="forgot-password">
              <a href="#">Quên mật khẩu?</a>
            </div>

            <button className="login-button">Đăng nhập</button>

            <p className="signup-text">
              Bạn chưa có tài khoản?{" "}
              <a href="#" className="signup-link">
                Đăng ký
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
