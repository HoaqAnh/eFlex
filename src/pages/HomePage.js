import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const username = "Jack4";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if(token == null)
      navigate("/login")
  }, [token, navigate]);
  
  return (
    <div className="home">
      <Navbar username={username} />
      
      <div className="content">
        <Sidebar />

        <main className="main">
          <div className="welcome">
            <div className="welcome__content">
              <h2 className="welcome__title">Chào mừng bạn đến với eFlex</h2>
              <p className="welcome__text">
                Chúng tôi rất vui mừng khi bạn đã chọn EFlex làm người bạn đồng
                hành trên con đường học tập. EFlex là Hệ thống hỗ trợ học tập dựa
                trên năng lực cá nhân.
              </p>
              <div className="welcome__buttons">
                <button className="welcome__button welcome__button--primary">Bắt đầu</button>
                <button className="welcome__button welcome__button--secondary">Đọc thêm</button>
              </div>
            </div>
          </div>

          <div className="sections">
            <div className="section section--progress">
              <h3 className="section__title">Tiến độ học tập</h3>
              <div className="section__progress-chart"></div>
            </div>

            <div className="section section--courses">
              <h3 className="section__title">Khóa học</h3>
              <div className="section__course-list">
                <div className="course-item">
                  <h4 className="course-item__title">Khóa học 1</h4>
                  <button className="course-item__button course-item__button--continue">Tiếp tục</button>
                </div>
                <div className="course-item">
                  <h4 className="course-item__title">Khóa học 2</h4>
                  <button className="course-item__button course-item__button--join">Tham gia</button>
                </div>
                <div className="course-item">
                  <h4 className="course-item__title">Khóa học 3</h4>
                  <button className="course-item__button course-item__button--join">Tham gia</button>
                </div>
                <div className="course-item">
                  <h4 className="course-item__title">Khóa học 4</h4>
                  <button className="course-item__button course-item__button--join">Tham gia</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;