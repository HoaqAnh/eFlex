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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if(token == null)
      navigate("/login")
  }, [token, navigate]);
  
  return (
    <div className="home-container">
      {/* Top Navigation Bar */}
      <Navbar username={username} onlogout={handleLogout}/>
      
      <div className="content-wrapper">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="main-content">
          {/* Welcome Card */}
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>Chào mừng bạn đến với eFlex</h2>
              <p>
                Chúng tôi rất vui mừng khi bạn đã chọn EFlex làm người bạn đồng
                hành trên con đường học tập. EFlex là Hệ thống hỗ trợ học tập dựa
                trên năng lực cá nhân.
              </p>
              <div className="welcome-buttons">
                <button className="primary-btn">Bắt đầu</button>
                <button className="secondary-btn">Đọc thêm</button>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="content-sections">
            {/* Learning Progress */}
            <div className="section progress-section">
              <h3>Tiến độ học tập</h3>
              <div className="progress-chart">
                <div className="placeholder-progress"></div>
              </div>
            </div>

            {/* Courses */}
            <div className="section courses-section">
              <h3>Khóa học</h3>
              <div className="course-list">
                <div className="course-item">
                  <h4>Khóa học 1</h4>
                  <button className="continue-btn">Tiếp tục</button>
                </div>
                <div className="course-item">
                  <h4>Khóa học 2</h4>
                  <button className="join-btn">Tham gia</button>
                </div>
                <div className="course-item">
                  <h4>Khóa học 3</h4>
                  <button className="join-btn">Tham gia</button>
                </div>
                <div className="course-item">
                  <h4>Khóa học 4</h4>
                  <button className="join-btn">Tham gia</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;