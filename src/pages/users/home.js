import React from "react";
import { useNavigate } from "react-router-dom";

//components
import Navbar from "../../components/layout/navbar";
import Sidebar from "../../components/layout/sidebar";
import Welcome from "../../components/home/Welcome";
import ProgressSection from "../../components/home/ProgressSection";
import CourseSection from "../../components/home/CourseSection";

//hooks
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/users/home.css";

function HomePage() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">Có lỗi xảy ra: {error}</div>;
  }

  if (!isAuthenticated) {
    navigate("/login");
  }

  if (isAdmin) {
    console.log("isAdmin", isAdmin);
    navigate("/dashboard");
  }

  return (
    <div className="home">
      <Navbar />

      <div className="content">
        <Sidebar />

        <main className="main">
          <Welcome />

          <div className="sections">
            <ProgressSection />
            <CourseSection />
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
