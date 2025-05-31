import React, { useState } from "react";

//hooks
import { useAuth } from "../../hooks/useAuth"

//components
import Header from "../../components/auth/register/header";
import Body from "../../components/auth/register/body";

//style
import "../../styles/authentication/style.css"

//Image
import Image from "./../../assets/images/login-image.png";

const Register = () => {
    const imageURL = Image;
    const { handleRegister, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleRegister(
                formData.fullname, 
                formData.email, 
                formData.newPassword,
                formData.confirmPassword
            );
        } catch (error) {
            // Error is already handled in handleRegister
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
        <div className="register">
            <div className="register__main-content">
                <Header />
                <Body 
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    loginImage={imageURL}
                />
            </div>
        </div>
    );
};

export default Register;