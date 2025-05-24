import React, { useEffect } from "react";
import { useModel } from "../../../hooks/model/useModel"
import Recommend from "./recommend"
import "../../../styles/users/home/header.css"

const Header = ({ UserData }) => {
    const { courses, recommendData, loading: recommendDataLoading, error: recommendDataError } = useModel();
    const userInfo = {
        name: UserData.fullname,
        id: UserData.id,
        avatar: "./avatar",
        news: "Chào mừng bạn đến với eFlex, chúc bạn có một trải nghiệm và học tập tốt trên ứng dụng của chúng tôi!"
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
                            Thông báo
                        </p>
                        <p className="home-header__container-left__bottom-content">
                            {userInfo.news}
                        </p>
                    </div>
                </div>
                <div className="home-header__container-right">
                    <Recommend
                        recommendData={recommendData}
                        loading={recommendDataLoading}
                        error={recommendDataError}
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;