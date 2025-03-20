import React from "react";
import "../styles/ChatPage.css";
import ChatContent from "../components/Chat/ChatContent";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/ChatPage.css";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";

function ChatPage() {
  const username = "Jack4"
  return (
    <div className="chat-container">
      {/* Top Navigation Bar */}
      <Navbar username={username} />

      <div className="content-wrapper">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="main-content">
            <ChatContent />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
