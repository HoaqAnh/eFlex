import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//components
import Navbar from "../../components/users/layout/navbar";
import Sidebar from "../../components/users/layout/sidebar";
import Welcome from "../../components/users/home/Welcome";
import ProgressSection from "../../components/users/home/ProgressSection";
import CourseSection from "../../components/users/home/CourseSection";

//hooks
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/users/home.css";

function HomePage() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">Có lỗi xảy ra: {error}</div>;
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
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
