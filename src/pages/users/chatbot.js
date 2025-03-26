import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//hooks
import { useAuth } from "../../hooks/useAuth";

//components
import Navbar from "../../components/layout/navbar";
import Sidebar from "../../components/layout/sidebar";
import ChatContent from "../../components/chatbot/ChatContent";

//style
import "../../styles/chatbot/chatbot.css";

function ChatPage() {
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
    navigate("/dashboard");
  }

  return (
    <div className="chat">
      <Navbar />

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