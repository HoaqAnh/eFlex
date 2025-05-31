import React from "react";

//style
import "../../../styles/users/account/header.css"

const Header = () => {
    const userInfo = {
        avatar_url: "./avatar",
        user_name: "Tran Pham Hoang Anh",
        address: "Tp. Hồ Chí Minh",
        age: "21",
        education: "High School",
        email: "hoanganh@gmail.com",
        password: "hoanganh123",
        auth_provider: "google"
    }
    return (
        <div className="account-header">
            <div className="account-header__container">
                <div className="account-header__container_avatar">
                    <img src={userInfo.avatar_url} alt="avatar" loading="lazy" />
                </div>
                <div className="account-header__container_username">
                    <h1>Hi, {userInfo.user_name} !</h1>
                </div>
            </div>

        </div>
    );
}

export default Header;