import React, { useEffect } from "react";
import { useModel } from "../../../hooks/model/useModel"
import Recommend from "./recommend"
import "../../../styles/users/home/header.css"
import AvatarDefault from "../../../assets/images/defaultAvatar.png";

const Header = ({ UserData }) => {
    const { courses, recommendData, loading: recommendDataLoading, error: recommendDataError } = useModel();

    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        courses(UserData.id);
    }, [courses, UserData.id]);

    return (
        <div className="home-header">
            <div className="home-header__container">
                <div className="home-header__container-left">
                    <div className="home-header__container-left__top">
                        <img src={AvatarDefault} alt="avatar" loading="lazy" />
                        <div className="home-header__container-divider__vertical" />
                        <div className="home-header__container-left__top-content">
                            <p className="welcome-content">Xin chào, {UserData.fullname}!</p>
                            <p className="time-content">{today}</p>
                        </div>
                    </div>
                    <div className="home-header__container-left__bottom">
                        <p className="home-header__container-left__bottom-title">
                            Thông báo
                        </p>
                        <p className="home-header__container-left__bottom-content">
                            eFlex là ứng dụng web học tập đột phá, được thiết kế để cá nhân hóa lộ trình kiến thức của bạn. 
                            Bằng cách phân tích năng lực riêng biệt, eFlex đề xuất nội dung học tập phù hợp, giúp bạn tiếp cận tri thức một cách hiệu quả và tối ưu nhất.
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