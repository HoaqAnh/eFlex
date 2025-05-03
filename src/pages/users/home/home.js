import React from "react";

//components
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/users/layout/sidebar";
import Header from "../../../components/users/home/header";
import Body from "../../../components/users/home/body";
import Footer from "../../../components/users/home/footer";

//hooks
import { useAuth } from "../../../hooks/useAuth";

//style
import "../../../styles/users/home/style.css";

const HomePage = () => {
  const { checkAuth } = useAuth();
  const authCheck = checkAuth();

  if (!authCheck.shouldRender) {
    return authCheck.component;
  }

  return (
    <div className="home">
      <Navbar />
      <div className="home__content-wrapper">
        <Sidebar />
        <div className="home__main-content">
          <Header />
          <Body />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
