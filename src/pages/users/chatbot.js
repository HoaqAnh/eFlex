import React from "react";

//hooks
import { useAuth } from "../../hooks/useAuth";

//components
import Navbar from "../../components/navbar";
import Sidebar from "../../components/users/layout/sidebar";
import ChatContent from "../../components/users/chatbot/ChatContent";

//style
import "../../styles/users/chatbot/chatbot.css";

const ChatPage = () => {
  const { checkAuth } = useAuth();
  const authCheck = checkAuth();

  if (!authCheck.shouldRender) {
      return authCheck.component;
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