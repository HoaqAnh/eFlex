import React from "react";

//component
import Form from "./form";

//style
import "../../../styles/authentication/body.css"

const Body = ({ loginImage, formData, handleChange, handleSubmit, isLoading }) => {
    return (
        <div className="register-body">
            <div className="register-body__left">
                <img src={loginImage} alt="eFlex" className="image" loading='lazy' />
            </div>
            <div className="register-body__right">
                <div className="divider">
                    <span>Đăng ký tài khoản</span>
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
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
                <p className="login-prompt">
                    Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
}

export default Body;