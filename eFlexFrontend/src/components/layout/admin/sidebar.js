import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/layout/sidebar.css";

// SVG Icon Components
const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M14 9q-.425 0-.712-.288T13 8V4q0-.425.288-.712T14 3h6q.425 0 .713.288T21 4v4q0 .425-.288.713T20 9zM4 13q-.425 0-.712-.288T3 12V4q0-.425.288-.712T4 3h6q.425 0 .713.288T11 4v8q0 .425-.288.713T10 13zm10 8q-.425 0-.712-.288T13 20v-8q0-.425.288-.712T14 11h6q.425 0 .713.288T21 12v8q0 .425-.288.713T20 21zM4 21q-.425 0-.712-.288T3 20v-4q0-.425.288-.712T4 15h6q.425 0 .713.288T11 16v4q0 .425-.288.713T10 21z" />
  </svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-labelledby="bookIconTitle">
    <title id="bookIconTitle">Học tập</title>
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v7l-2.5-1.5L6 11V4z" />
  </svg>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const activeMenu = location.pathname.replace("/", "") || "Dashboard";

  const handleMenuClick = (menuId) => {
    if (menuId === "Dashboard") {
      navigate("/admin");
    } else if (menuId === "courses") {
      navigate("/admin/course");
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
            className={activeMenu === "admin" ? "active" : ""}
            onClick={() => handleMenuClick("Dashboard")}
            title={!isExpanded ? "Dashboard" : ""}
          >
            <div className="nav-icon">
              <IconDashboard />
            </div>
            <span>Dashboard</span>
          </li>

          <li
            className={activeMenu === "admin/course" ? "active" : ""}
            onClick={() => handleMenuClick("courses")}
            title={!isExpanded ? "Courses" : ""}
          >
            <div className="nav-icon">
              <IconBook />
            </div>
            <span>Khóa học</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;