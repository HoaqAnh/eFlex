import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu = location.pathname.replace("/", "") || "homePanel";

  const handleMenuClick = (menuId) => {
    if (menuId === "homePanel") {
      navigate("/homePanel");
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
            className={activeMenu === "homePanel" ? "active" : ""}
            onClick={() => handleMenuClick("homePanel")}
          >
            <div className="nav-icon">
              <img src={require("../../assets/icons/iconHome.png")} alt="HomePanel" width="24" height="24" />
            </div>
            <span>Trang chủ</span>
          </li>
          
          <li 
            className={activeMenu === "coursePanel" ? "active" : ""}
            onClick={() => handleMenuClick("coursePanel")}
          >
            <div className="nav-icon">
              <img src={require("../../assets/icons/iconBook.png")} alt="CoursePanel" width="24" height="24" />
            </div>
            <span>Khóa học</span>
          </li>
          
          <li 
            className={activeMenu === "systemPanel" ? "active" : ""}
            onClick={(Navigate) => handleMenuClick("systemPanel")}
          >
            <div className="nav-icon">
              <img src={require("../../assets/icons/iconSmile.png")} alt="SystemPanel" width="24" height="24" />
            </div>
            <span>Hệ thống</span>
          </li>
          
          <li 
            className={activeMenu === "dataPanel" ? "active" : ""}
            onClick={() => handleMenuClick("dataPanel")}
          >
            <div className="nav-icon">
              <img src={require("../../assets/icons/iconUsers.png")} alt="DataPanel" width="24" height="24" />
            </div>
            <span>Dữ liệu</span>
          </li>
          
          <li 
            className={activeMenu === "settingsPanel" ? "active" : ""}
              onClick={() => handleMenuClick("settingsPanel")}
          >
            <div className="nav-icon">
              <img src={require("../../assets/icons/iconSettings.png")} alt="SettingsPanel" width="24" height="24" />
            </div>
            <span>Cài đặt</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;