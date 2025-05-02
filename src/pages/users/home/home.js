import React from "react";

//components
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/users/layout/sidebar";
import Welcome from "../../../components/users/home/Welcome";
import ProgressSection from "../../../components/users/home/ProgressSection";

//hooks
import { useAuth } from "../../../hooks/useAuth";

//style
import "../../../styles/users/home.css";

const HomePage = () => {
  const { checkAuth } = useAuth();
  const authCheck = checkAuth();

  if (!authCheck.shouldRender) {
      return authCheck.component;
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
