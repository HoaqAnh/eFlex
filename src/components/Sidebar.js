import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu = location.pathname.replace("/", "") || "home";

  const handleMenuClick = (menuId) => {
    if (menuId === "chatbot") {
      navigate("/chatbot");
    } else if (menuId === "home") {
      navigate("/home");
    } else if (menuId === "study") {
      navigate("/study");
    } else if (menuId === "account") {
      navigate("/account");
    } else if (menuId === "settings") {
      navigate("/settings");
    }
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
            onClick={(Navigate) => handleMenuClick("chatbot")}
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