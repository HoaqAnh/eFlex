import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//hooks
import { useAuth } from "../hooks/useAuth";

//logo
import eFlexLogo from "../assets/logo/eFlex.png";

//style
import "../styles/layout/navbar.css";

function Navbar() {
  const [activeButton, setActiveButton] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userMenuRef = useRef(null);
  const userBtnRef = useRef(null);
  const navigate = useNavigate();

  const { username, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userBtnRef.current &&
        !userBtnRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleAccountClick = () => {
    navigate("/account");
    setShowUserMenu(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setShowUserMenu(false);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <img src={eFlexLogo} alt="eFlex Logo" className="navbar__logo-image" />
      </div>
      <div className="navbar__actions">
        <button
          className={`navbar__button ${activeButton === "help" ? "navbar__button--active" : ""
            }`}
          onMouseEnter={() => setActiveButton("help")}
          onMouseLeave={() => setActiveButton(null)}
          title="Trợ giúp"
        >
          <svg
            className="navbar__button-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M11.5 16.5h1V11h-1zm.5-6.923q.262 0 .439-.177t.176-.439t-.177-.438T12 8.346t-.438.177t-.177.439t.177.438t.438.177M12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
            />
          </svg>
        </button>
        <button
          className={`navbar__button ${activeButton === "theme" ? "navbar__button--active" : ""
            }`}
          onMouseEnter={() => setActiveButton("theme")}
          onMouseLeave={() => setActiveButton(null)}
          title="Đổi giao diện"
        >
          <svg
            className="navbar__button-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"
            />
          </svg>
        </button>
        <button
          className={`navbar__button ${activeButton === "notifications" ? "navbar__button--active" : ""
            }`}
          onMouseEnter={() => setActiveButton("notifications")}
          onMouseLeave={() => setActiveButton(null)}
          title="Thông báo"
        >
          <svg
            className="navbar__button-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor">
              <path d="M18.934 14.98a3 3 0 0 1-.457-1.59V9.226a6.477 6.477 0 0 0-12.954 0v4.162a3 3 0 0 1-.457 1.592l-1.088 1.74a1 1 0 0 0 .848 1.53h14.348a1 1 0 0 0 .848-1.53z" />
              <path d="M10 21.25h4" />
            </g>
          </svg>
        </button>
        <div className="navbar__user-container">
          <button
            ref={userBtnRef}
            className={`navbar__button ${activeButton === "user" || showUserMenu
                ? "navbar__button--active"
                : ""
              }`}
            onMouseEnter={() => setActiveButton("user")}
            onMouseLeave={() => setActiveButton(null)}
            onClick={handleUserClick}
            title="Thông tin người dùng"
          >
            <svg
              className="navbar__button-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </g>
            </svg>
          </button>

          {showUserMenu && (
            <div ref={userMenuRef} className="user-dropdown">
              <div className="user-dropdown__item" onClick={handleAccountClick}>
                <svg
                  className="user-dropdown__item-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"
                  />
                </svg>
                <span>Tài khoản</span>
              </div>
              <div className="user-dropdown__divider"></div>
              <div
                className="user-dropdown__item user-dropdown__item--logout"
                onClick={handleLogoutClick}
              >
                <svg
                  className="user-dropdown__item-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5zm16 7l-4-4v3H9v2h8v3l4-4z"
                  />
                </svg>
                <span>Đăng xuất</span>
              </div>
            </div>
          )}
        </div>
        <div className="navbar__user-profile">
          {username && <span>{username}</span>}
        </div>
      </div>
      <div className="navbar__bottom-line"></div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="modal">
          <div className="modal__content">
            <div className="modal__header">
              <h3 className="modal__title">Xác nhận đăng xuất</h3>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
              </p>
            </div>
            <div className="modal__footer">
              <button
                className="modal__button modal__button--cancel"
                onClick={cancelLogout}
              >
                Hủy
              </button>
              <button
                className="modal__button modal__button--confirm"
                onClick={confirmLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
