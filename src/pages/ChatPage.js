import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Navbar.css";
import "../styles/Sidebar.css";
import "../styles/ChatPage.css";
import ChatContent from "../components/Chat/ChatContent";

function ChatPage() {
  const navigate = useNavigate();
  const username = "Jack4"
  const token = localStorage.getItem("token");

  useEffect(() => {
    if(token == null)
      navigate("/login")
  }, [token, navigate]);
  
  return (
    <div className="chat">
      <Navbar username={username} />

      <div className="chat__content">
        <Sidebar />
        <main className="chat__main">
          <div className="chat__main-content">
            <ChatContent />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatPage;
