import React, { useState } from "react";
import "../styles/Navbar.css";
import eFlexLogo from "../assets/images/logo_app.png"; // Adjust path as needed

function Navbar({ username, onLogout }) {
  const [activeButton, setActiveButton] = useState(null);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={eFlexLogo} alt="eFlex Logo" className="logo"/>
      </div>
      <div className="navbar-actions">
        <button 
          className={`nav-icon-btn ${activeButton === 'help' ? 'active' : ''}`}
          onMouseEnter={() => setActiveButton('help')}
          onMouseLeave={() => setActiveButton(null)}
          title="Trợ giúp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.5 16.5h1V11h-1zm.5-6.923q.262 0 .439-.177t.176-.439t-.177-.438T12 8.346t-.438.177t-.177.439t.177.438t.438.177M12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
          </svg>
        </button>
        <button 
          className={`nav-icon-btn ${activeButton === 'theme' ? 'active' : ''}`}
          onMouseEnter={() => setActiveButton('theme')}
          onMouseLeave={() => setActiveButton(null)}
          title="Đổi giao diện"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7" />
          </svg>
        </button>
        <button 
          className={`nav-icon-btn ${activeButton === 'notifications' ? 'active' : ''}`}
          onMouseEnter={() => setActiveButton('notifications')}
          onMouseLeave={() => setActiveButton(null)}
          title="Thông báo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor">
              <path d="M18.934 14.98a3 3 0 0 1-.457-1.59V9.226a6.477 6.477 0 0 0-12.954 0v4.162a3 3 0 0 1-.457 1.592l-1.088 1.74a1 1 0 0 0 .848 1.53h14.348a1 1 0 0 0 .848-1.53z" />
              <path d="M10 21.25h4" />
            </g>
          </svg>
        </button>
        <button 
          className={`nav-icon-btn ${activeButton === 'user' ? 'active' : ''}`}
          onMouseEnter={() => setActiveButton('user')}
          onMouseLeave={() => setActiveButton(null)}
          title="Thông tin người dùng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </g>
          </svg>
        </button>
        <div 
          className="user-profile" 
          onClick={onLogout}
          onMouseEnter={() => setActiveButton('profile')}
          onMouseLeave={() => setActiveButton(null)}
        >
          <span>{username}</span>
        </div>
      </div>
      <div className="navbar-bottom-line"></div>
    </div>
  );
}

export default Navbar;