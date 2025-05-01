import React from "react";

//components
import GoogleBtn from "./googleBtn";
import Form from "./form";

//style
import "../../../styles/authentication/body.css"

const Body = ({ loginImage, formData, handleChange, handleSubmit, isLoading }) => {
    return (
        <div className="login-body">
            <div className="login-body__left">
                <img src={loginImage} alt="eFlex" className="image" loading='lazy' />
            </div>
            <div className="login-body__right">
                <div className="divider">
                    <span>Tiếp tục với</span>
                </div>
                <GoogleBtn />
                <div className="divider">
                    <span>hoặc đăng nhập bằng gmail của bạn</span>
                </div>
                <Form 
                    formData={formData}
                    handleChange={handleChange}
                />
                <button 
                    type="submit" 
                    className="auth-btn"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                <p className="register-prompt">
                    Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
                </p>
            </div>
        </div>
    );
}

export default Body;