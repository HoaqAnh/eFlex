import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth"
import Header from "../../components/auth/login/header"
import Body from "../../components/auth/login/body"
import "../../styles/authentication/style.css"
import Image from "./../../assets/images/login-image.png";

const Login = () => {
    const iamgeURL = Image;
    const { handleLogin, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(formData.email, formData.password);
        } catch (error) {
            // Error is already handled in handleLogin
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="login">
            <div className="login__main-content">
                <Header />
                <Body 
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    loginImage={iamgeURL}
                />
            </div>
        </div>
    );
};

export default Login;