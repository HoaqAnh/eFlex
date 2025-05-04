import React from "react";

//component
import Recommend from "./recommend"

//style
import "../../../styles/users/home/header.css"

const Header = () => {
    const user = "Nguoi dung 1";
    const avatar = "./avatar"
    const news = "eFlex ứng dụng cung cấp tài liệu phù hợp, đánh giá chính xác và hỗ trợ rèn luyện hiệu quả. Hãy khám phá eFlex ngay hôm nay để nâng cao kiến thức một cách linh hoạt!"
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
                            <img src={avatar} alt="avatar" loading="lazy" className="avatarImage" />
                        </div>
                        <div className="home-header__container-divider__vertical" />
                        <div className="home-header__container-left__top-content">
                            <p className="welcome-content">Xin chào, {user}!</p>
                            <p className="time-content">{today}</p>
                        </div>
                    </div>
                    <div className="home-header__container-left__bottom">
                        <p className="home-header__container-left__bottom-title">
                            Tin tức
                        </p>
                        <p className="home-header__container-left__bottom-content">
                            {news}
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


// <div className="home-header__divider-vertical" />