import React from "react";

//style
import "../../../styles/users/home/header.css"

const Header = () => {
    const user = "Nguoi dung 1";
    const avatar = "./avatar"

    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="home-header">
            <div className="home-header__container">
                <div className="home-header__container-left">
                    <div className="home-header__container-left__avatar">
                        <img src={avatar} alt="avatar" loading="lazy" className="avatarImage" />
                    </div>
                    <div className="home-header__container-left__content">
                        <h4>Xin chào, {user}!</h4>
                        <p>{today}</p>
                    </div>

                </div>
                <div className="home-header__divider-vertical" />
                <div className="home-header__container-right">
                    <p>Cảm ơn bạn đã tin tưởng và sử dụng Eflex. Eflex xin chào và chúc bạn học tốt.</p>
                </div>
            </div>
        </div>
    );
}

export default Header;