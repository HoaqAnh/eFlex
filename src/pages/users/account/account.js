import React from "react";

//components
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/users/layout/sidebar";
import Header from "../../../components/users/account/header";
import Body from "../../../components/users/account/body";

//hooks
import { useAuth } from "../../../hooks/useAuth";

//style
import "../../../styles/users/account/style.css";

const Account = () => {
  const { checkAuth } = useAuth();
  const authCheck = checkAuth();

  if (!authCheck.shouldRender) {
    return authCheck.component;
  }

  return (
    <div className="account">
      <Navbar />
      <div className="account__content-wrapper">
        <Sidebar />
        <div className="account__main-content">
          <div className="account__main-content_card">
            <Header />
            <Body />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
