import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import eFlexLogo from '../assets/images/logo_app.png'; // Adjust path as needed

function HomePage() {
  const navigate = useNavigate();
  const username = "Jack4"; // This would come from your authentication
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Navigation Side Bar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={eFlexLogo} alt="eFlex Logo" className="logo" />
        </div>
        
        <nav className="side-navigation">
          <ul>
            <li className="active">
              <i className="home-icon">🏠</i>
              <span>Trang chủ</span>
            </li>
            <li>
              <i className="study-icon">📚</i>
              <span>Học tập</span>
            </li>
            <li>
              <i className="chatbot-icon">💬</i>
              <span>Chatbot</span>
            </li>
            <li>
              <i className="account-icon">👤</i>
              <span>Tài khoản</span>
            </li>
            <li>
              <i className="settings-icon">⚙️</i>
              <span>Cài đặt</span>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Navigation Bar */}
        <header className="top-nav">
          <div className="nav-icons">
            <button className="icon-btn">⍰</button>
            <button className="icon-btn">🔆</button>
            <button className="icon-btn">🔔</button>
            <div className="user-profile" onClick={handleLogout}>
              <span>{username}</span>
            </div>
          </div>
        </header>
        
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="welcome-content">
            <h2>Chào mừng bạn đến với eFlex</h2>
            <p>
              Chúng tôi rất vui mừng khi bạn đã chọn EFlex làm người bạn đồng hành 
              trên con đường học tập. EFlex là Hệ thống hỗ trợ học tập dựa trên 
              năng lực cá nhân.
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
              {/* This would be a chart or progress visualization */}
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
  );
}

export default HomePage;