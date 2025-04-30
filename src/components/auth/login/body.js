import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//style
import "../../../styles/authentication/body.css"

//components
import GoogleLoginButton from "./GoogleLoginButton";
import Email from "./email";

//images
import LoginImage from "./../../../assets/images/login-image.png";

//hooks
import { useAuth } from "../../../hooks/useAuth"

const Body = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(email, password);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-body">
            <div className="login-body__left">
                <img src={LoginImage} alt="eFlex image" className="image" loading='lazy' />
            </div>
            <div className="login-body__right">
                <div className="divider">
                    <span>Tiếp tục với</span>
                </div>
                <GoogleLoginButton />
                <div className="divider">
                    <span>hoặc đăng nhập bằng gmail của bạn</span>
                </div>
                <Email
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

export default Body;