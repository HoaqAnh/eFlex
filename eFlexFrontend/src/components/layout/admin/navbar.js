import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import DialogPopup from "../../../components/users/test/dialogPopup";
import "../../../styles/layout/navbar.css";
import "../../../styles/theme.css";

const Navbar = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userMenuRef = useRef(null);
  const userBtnRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  const handleLogoClick = () => {
    navigate("/admin");
  };

  return (
    <div className="navbar">
      <div 
        className="navbar__logo" 
        onClick={handleLogoClick} 
        title="Về trang chủ eFlex"
      >
        <span className="navbar__logo-text-e">E-</span>
        <span className="navbar__logo-text-flex">Flex</span>
      </div>
      <div className="navbar__actions">
        <button
          className={`navbar__button ${activeButton === "theme" ? "navbar__button--active" : ""}`}
          onMouseEnter={() => setActiveButton("theme")}
          onMouseLeave={() => setActiveButton(null)}
          onClick={toggleTheme}
          title={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
        >
          <svg
            className="navbar__button-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            {theme === 'light' ? (
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"
              />
            ) : (
              <path
                fill="currentColor"
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9s9-4.03 9-9c0-.46-.04-.92-.1-1.36c-.98 1.37-2.58 2.26-4.4 2.26c-2.98 0-5.4-2.42-5.4-5.4c0-1.81.89-3.42 2.26-4.4c-.44-.06-.9-.1-1.36-.1z"
              />
            )}
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
          {user?.fullname && <span>{user?.fullname}</span>}
        </div>
      </div>
      <div className="navbar__bottom-line"></div>
      <DialogPopup
        isOpen={showLogoutConfirm}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?"
      />
    </div >
  );
}

export default Navbar;