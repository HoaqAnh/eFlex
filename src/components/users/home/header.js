import React from "react";

//component
import Recommend from "./recommend"

//style
import "../../../styles/users/home/header.css"

const Header = () => {
    const info = {
        user: "Nguoi dung 1",
        avatar: "./avatar",
        news: "Doanh nghiệp ba thành viên mỗi người trúng 20 tỷ. Xin chúc mừng !"
    }

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
                    <div className="home-header__container-left__top">
                        <div className="home-header__container-left__top-avatar">
                            <img src={info.avatar} alt="avatar" loading="lazy" className="avatarImage" />
                        </div>
                        <div className="home-header__container-divider__vertical" />
                        <div className="home-header__container-left__top-content">
                            <p className="welcome-content">Xin chào, {info.user}!</p>
                            <p className="time-content">{today}</p>
                        </div>
                    </div>
                    <div className="home-header__container-left__bottom">
                        <p className="home-header__container-left__bottom-title">
                            Tin tức
                        </p>
                        <p className="home-header__container-left__bottom-content">
                            {info.news}
                        </p>
                    </div>
                </div>
                <div className="home-header__container-right">
                    <Recommend />
                </div>
            </div>
        </div>
    );
}

export default Header;