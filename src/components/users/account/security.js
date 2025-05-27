import React, { useState } from "react";
import Form from "./form";
//style
import "../../../styles/users/account/security.css"

const Security = () => {
    const [userInfo, setUserInfo] = useState({
        avatar_url: "./avatar",
        user_name: "Tran Pham Hoang Anh",
        address: "Tp. Hồ Chí Minh",
        age: "21",
        education: "High School",
        email: "hoanganh@gmail.com",
        password: "hoanganh123",
        auth_provider: "Google"
    });

    const [isEditDialogOpen, setIsEditDialogOpen] = useState({
        email: false,
        password: false
    });

    const handleUpdateForm = (type) => {
        setIsEditDialogOpen((prevState) => ({
            ...prevState,
            [type]: true,
        }));
    };

    const handleSaveChange = (type, newValue) => {
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [type]: newValue,
        }));
        setIsEditDialogOpen((prevState) => ({
            ...prevState,
            [type]: false,
        }));
        console.log(`Đã cập nhật ${type}:`, newValue);
        // Gọi API để lưu dữ liệu thực tế
    };

    const handleCloseDialog = (type) => {
        setIsEditDialogOpen((prevState) => ({
            ...prevState,
            [type]: false,
        }));
    };

    const SVG = ({ type }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="-0.5 -0.5 24 24"
            onClick={() => handleUpdateForm(type)}
        >
            <path
                fill="currentColor"
                d="m21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.93.93 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z"
            />
        </svg>
    );

    return (
        <div className="account-security">
            <div className="account-security__container">
                <div className="account-security__input">
                    <p>
                        Email: <b>{userInfo.email}</b>
                    </p>
                    <SVG type="email" />
                </div>
                <Form
                    type="email"
                    isOpen={isEditDialogOpen.email}
                    onClose={() => handleCloseDialog("email")}
                    onSubmit={(newValue) => handleSaveChange("email", newValue)}
                    initialValue={userInfo.email}
                />

                <div className="account-security__input">
                    <p>Nhà cung cấp xác thực: <b>{userInfo.auth_provider}</b></p>
                    <SVG type="auth_provider" />
                </div>
                <Form
                    type="auth_provider"
                    isOpen={isEditDialogOpen.auth_provider}
                    onClose={() => handleCloseDialog("auth_provider")}
                />

                <div className="account-security__input">
                    <p>Mật khẩu: <b>********</b></p>
                    <SVG type="password" />
                </div>
                <Form
                    type="password"
                    isOpen={isEditDialogOpen.password}
                    onClose={() => handleCloseDialog("password")}
                    onSubmit={(newPassword) => handleSaveChange("password", newPassword)}
                />
            </div>
        </div>
    );
};

export default Security;