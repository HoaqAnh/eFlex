import React, { useEffect } from "react";

//hooks
import { useModel } from "../../../hooks/model/useModel"

//component
import Recommend from "./recommend"

//style
import "../../../styles/users/home/header.css"

const Header = (user) => {
    const { courses, recommendData, loading, error } = useModel();
    const userInfo = {
        name: user.user.fullname,
        id: user.user.id,
        avatar: "./avatar",
        news: "Doanh nghiệp ba thành viên mỗi người trúng 20 tỷ. Xin chúc mừng !"
    }
    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        courses(userInfo.id);
    }, [courses, userInfo.id]);
    
    return (
        <div className="home-header">
            <div className="home-header__container">
                <div className="home-header__container-left">
                    <div className="home-header__container-left__top">
                        <div className="home-header__container-left__top-avatar">
                            <img src={userInfo.avatar} alt="avatar" loading="lazy" className="avatarImage" />
                        </div>
                        <div className="home-header__container-divider__vertical" />
                        <div className="home-header__container-left__top-content">
                            <p className="welcome-content">Xin chào, {userInfo.name}!</p>
                            <p className="time-content">{today}</p>
                        </div>
                    </div>
                    <div className="home-header__container-left__bottom">
                        <p className="home-header__container-left__bottom-title">
                            Tin tức
                        </p>
                        <p className="home-header__container-left__bottom-content">
                            {userInfo.news}
                        </p>
                    </div>
                </div>
                <div className="home-header__container-right">
                    <Recommend
                        recommendData={recommendData}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;