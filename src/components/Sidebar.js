import React, { useState } from "react";
import "../styles/Sidebar.css";

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("home");
  
  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    // Ở đây bạn có thể thêm logic để điều hướng hoặc hiển thị content tương ứng
  };

  return (
    <div className="sidebar">
      <nav className="side-navigation">
        <ul>
          <li 
            className={activeMenu === "home" ? "active" : ""}
            onClick={() => handleMenuClick("home")}
          >
            <div className="nav-icon">
              <img src={require("../assets/icons/iconHome.png")} alt="Home" width="24" height="24" />
            </div>
            <span>Trang chủ</span>
          </li>
          
          <li 
            className={activeMenu === "study" ? "active" : ""}
            onClick={() => handleMenuClick("study")}
          >
            <div className="nav-icon">
              <img src={require("../assets/icons/iconBook.png")} alt="Study" width="24" height="24" />
            </div>
            <span>Học tập</span>
          </li>
          
          <li 
            className={activeMenu === "chatbot" ? "active" : ""}
            onClick={() => handleMenuClick("chatbot")}
          >
            <div className="nav-icon">
              <img src={require("../assets/icons/iconSmile.png")} alt="Chatbot" width="24" height="24" />
            </div>
            <span>Chatbot</span>
          </li>
          
          <li 
            className={activeMenu === "account" ? "active" : ""}
            onClick={() => handleMenuClick("account")}
          >
            <div className="nav-icon">
              <img src={require("../assets/icons/iconUsers.png")} alt="Account" width="24" height="24" />
            </div>
            <span>Tài khoản</span>
          </li>
          
          <li 
            className={activeMenu === "settings" ? "active" : ""}
            onClick={() => handleMenuClick("settings")}
          >
            <div className="nav-icon">
              <img src={require("../assets/icons/iconSettings.png")} alt="Settings" width="24" height="24" />
            </div>
            <span>Cài đặt</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;