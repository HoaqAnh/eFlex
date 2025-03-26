import React from 'react';
import iconMail from "../../assets/icons/iconMail.png";
import iconPassword from "../../assets/icons/iconPassword.png";

const LoginForm = ({ email, setEmail, password, setPassword, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <div className="input-icon">
          <img
            src={iconMail}
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
            src={iconPassword}
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
  );
};

export default LoginForm; 