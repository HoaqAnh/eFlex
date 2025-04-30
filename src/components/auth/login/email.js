import React from 'react';

//icons
import IconMail from "../../../assets/icons/iconMail.png";
import IconPassword from "../../../assets/icons/iconPassword.png";

//sytle
import "../../../styles/authentication/email.css"

const Email = ({ email, setEmail, password, setPassword, onSubmit }) => (
    <form onSubmit={onSubmit}>
        <div className="form-group">
            <div className="input-icon">
                <img
                    src={IconMail}
                    className="input-icon-img"
                    alt="Email"
                />
                <input
                    className="loginPage_input"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />
            </div>
        </div>

        <div className="form-group">
            <div className="input-icon">
                <img
                    src={IconPassword}
                    className="input-icon-img"
                    alt="Password"
                />
                <input
                    className="loginPage_input"
                    id="password"
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
        <p className="register-prompt">
            Bạn chưa có tài khoản? <a href="#">Đăng ký</a>
        </p>
    </form>
);

export default Email;
