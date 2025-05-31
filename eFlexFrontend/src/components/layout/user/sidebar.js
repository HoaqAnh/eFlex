import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/layout/sidebar.css";

// SVG Icon Components
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19" />
  </svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-labelledby="bookIconTitle">
    <title id="bookIconTitle">Học tập</title>
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v7l-2.5-1.5L6 11V4z" />
  </svg>
);

const IconChatBot = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4.724l-4.762 2.857a1 1 0 0 1-1.508-.743L7 21v-2H6a4 4 0 0 1-3.995-3.8L2 15V7a4 4 0 0 1 4-4zm-2.8 9.286a1 1 0 0 0-1.414.014a2.5 2.5 0 0 1-3.572 0a1 1 0 0 0-1.428 1.4a4.5 4.5 0 0 0 6.428 0a1 1 0 0 0-.014-1.414M9.51 8H9.5a1 1 0 1 0 0 2h.01a1 1 0 0 0 0-2m5 0h-.01a1 1 0 0 0 0 2h.01a1 1 0 0 0 0-2" />
  </svg>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const activeMenu = location.pathname.replace("/", "") || "home";

  const handleMenuClick = (menuId) => {
    if (menuId === "chatbot") {
      navigate("/chatbot");
    } else if (menuId === "home") {
      navigate("/");
    } else if (menuId === "course") {
      navigate("/course");
    }
    // setIsExpanded(false); 
  };

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="side-navigation">
        <ul>
          <li
            className={activeMenu === "home" ? "active" : ""}
            onClick={() => handleMenuClick("home")}
            title={!isExpanded ? "Trang chủ" : ""}
          >
            <div className="nav-icon">
              <IconHome />
            </div>
            <span>Trang chủ</span>
          </li>

          <li
            className={activeMenu === "course" ? "active" : ""}
            onClick={() => handleMenuClick("course")}
            title={!isExpanded ? "Học tập" : ""}
          >
            <div className="nav-icon">
              <IconBook />
            </div>
            <span>Học tập</span>
          </li>

          <li
            className={activeMenu === "chatbot" ? "active" : ""}
            onClick={() => handleMenuClick("chatbot")}
            title={!isExpanded ? "Chatbot" : ""}
          >
            <div className="nav-icon">
              <IconChatBot />
            </div>
            <span>Chatbot</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;