import React from "react";
import Header from "../../../components/users/home/header";
import Body from "../../../components/users/home/body";
import { useAuth } from "../../../hooks/useAuth";
import "../../../styles/users/home/style.css";

const HomePage = () => {
  const { checkAuth, user } = useAuth();
  const authCheck = checkAuth();


  if (!authCheck.shouldRender) {
    return authCheck.component;
  }

  return (
    <div className="home">
      <Header user={user} />
      <Body />
    </div>
  );
}

export default HomePage;
