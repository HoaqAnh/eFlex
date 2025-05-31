import React, { useState } from "react";
import Form from "./form";
import "../../../styles/users/account/overview.css";

const Overview = () => {
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
        user_name: false,
        address: false,
        age: false,
        education: false,
        avatar_url: false
    });

    const educationOptions = ["High School", "Primary", "Secondary", "University"];

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
        <div className="account-overview">
            <div className="account-overview__container">
                <div className="account-overview__input">
                    <p>
                        Tên người dùng: <b>{userInfo.user_name}</b>
                    </p>
                    <SVG type="user_name" />
                </div>
                <Form
                    type="user_name"
                    isOpen={isEditDialogOpen.user_name}
                    onClose={() => handleCloseDialog("user_name")}
                    onSubmit={(newValue) => handleSaveChange("user_name", newValue)}
                    initialValue={userInfo.user_name}
                />

                <div className="account-overview__input">
                    <p>
                        Địa chỉ: <b>{userInfo.address}</b>
                    </p>
                    <SVG type="address" />
                </div>
                <Form
                    type="address"
                    isOpen={isEditDialogOpen.address}
                    onClose={() => handleCloseDialog("address")}
                    onSubmit={(newValue) => handleSaveChange("address", newValue)}
                    initialValue={userInfo.address}
                    label="Địa chỉ mới"
                />

                <div className="account-overview__input">
                    <p>
                        Tuổi: <b>{userInfo.age}</b>
                    </p>
                    <SVG type="age" />
                </div>
                <Form
                    type="age"
                    isOpen={isEditDialogOpen.age}
                    onClose={() => handleCloseDialog("age")}
                    onSubmit={(newValue) => handleSaveChange("age", newValue)}
                    initialValue={userInfo.age}
                    label="Tuổi mới"
                />

                <div className="account-overview__input">
                    <p>
                        Trình độ học vấn: <b>{userInfo.education}</b>
                    </p>
                    <SVG type="education" />
                </div>
                <Form
                    type="education"
                    isOpen={isEditDialogOpen.education}
                    onClose={() => handleCloseDialog("education")}
                    onSubmit={(newValue) => handleSaveChange("education", newValue)}
                    initialValue={userInfo.education}
                    options={educationOptions} // Truyền danh sách options
                />

                <div className="account-overview__input">
                    <p>Thay đổi ảnh đại diện</p>
                    <SVG type="avatar_url" />
                </div>
                <Form
                    type="avatar_url"
                    isOpen={isEditDialogOpen.avatar_url}
                    onClose={() => handleCloseDialog("avatar_url")}
                    onSubmit={(newFile) => handleSaveChange("avatar_url", newFile)}
                />
            </div>
        </div>
    );
};

export default Overview;