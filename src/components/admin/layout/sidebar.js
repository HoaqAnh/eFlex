import { useNavigate, useLocation } from "react-router-dom";

//style
import "../../../styles/layout/sidebar.css";

//icon
import iconHome from "../../../assets/icons/iconHome.png";
import iconBook from "../../../assets/icons/iconBook.png";
import iconSmile from "../../../assets/icons/iconSmile.png";
import iconUsers from "../../../assets/icons/iconUsers.png";
import iconSettings from "../../../assets/icons/iconSettings.png";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu = location.pathname.replace("/", "") || "dashboard";

  const handleMenuClick = (menuId) => {
    if (menuId === "dashboard") {
      navigate("/dashboard");
    } else if (menuId === "coursePanel") {
      navigate("/coursePanel");
    } else if (menuId === "systemPanel") {
      navigate("/systemPanel");
    } else if (menuId === "dataPanel") {
      navigate("/dataPanel");
    } else if (menuId === "settingsPanel") {
      navigate("/settingsPanel");
    }
  };
  return (
    <div className="sidebar">
      <nav className="side-navigation">
        <ul>
          <li 
            className={activeMenu === "dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard")}
          >
            <div className="nav-icon">
              <img src={iconHome} alt="dashboard" width="24" height="24" />
            </div>
            <span>Trang chủ</span>
          </li>
          
          <li 
            className={activeMenu === "coursePanel" ? "active" : ""}
            onClick={() => handleMenuClick("coursePanel")}
          >
            <div className="nav-icon">
              <img src={iconBook} alt="CoursePanel" width="24" height="24" />
            </div>
            <span>Khóa học</span>
          </li>
          
          <li 
            className={activeMenu === "systemPanel" ? "active" : ""}
            onClick={(Navigate) => handleMenuClick("systemPanel")}
          >
            <div className="nav-icon">
              <img src={iconSmile} alt="SystemPanel" width="24" height="24" />
            </div>
            <span>Hệ thống</span>
          </li>
          
          <li 
            className={activeMenu === "dataPanel" ? "active" : ""}
            onClick={() => handleMenuClick("dataPanel")}
          >
            <div className="nav-icon">
              <img src={iconUsers} alt="DataPanel" width="24" height="24" />
            </div>
            <span>Dữ liệu</span>
          </li>
          
          <li 
            className={activeMenu === "settingsPanel" ? "active" : ""}
              onClick={() => handleMenuClick("settingsPanel")}
          >
            <div className="nav-icon">
              <img src={iconSettings} alt="SettingsPanel" width="24" height="24" />
            </div>
            <span>Cài đặt</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;