import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/layout/sidebar.css";
import iconHome from "../../../assets/icons/iconHome.png";
import iconBook from "../../../assets/icons/iconBook.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu = location.pathname.replace("/", "") || "dashboard";

  const handleMenuClick = (menuId) => {
    if (menuId === "dashboard") {
      navigate("/admin");
    } else if (menuId === "course") {
      navigate("/admin/course");
    }
  };
  return (
    <div className="sidebar">
      <nav className="side-navigation">
        <ul>
          <li
            className={activeMenu === "admin" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard")}
          >
            <div className="nav-icon">
              <img src={iconHome} alt="dashboard" width="24" height="24" />
            </div>
            <span>Trang chủ</span>
          </li>

          <li
            className={activeMenu === "admin/course" ? "active" : ""}
            onClick={() => handleMenuClick("course")}
          >
            <div className="nav-icon">
              <img src={iconBook} alt="CoursePanel" width="24" height="24" />
            </div>
            <span>Khóa học</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;