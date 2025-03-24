import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWebSocket } from "../WebSocketContext";
import { getCurrentUser } from "../services/authService";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatContent from "../components/Chat/ChatContent";

import "../styles/Navbar.css";
import "../styles/Sidebar.css";
import "../styles/ChatPage.css";

function ChatPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isConnected, setUser } = useWebSocket();

  // State để lưu thông tin người dùng
  const [user, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Kiểm tra token và fetch thông tin người dùng
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!hasAttemptedFetch) {
      const fetchUser = async () => {
        try {
          setHasAttemptedFetch(true);
          const userData = await getCurrentUser();

          const roleName = userData.data.roleName;
          setIsAdmin(roleName == "admin");

          setUserData(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
          navigate("/login");
        }
      };

      fetchUser();
    }
  }, [token, navigate, hasAttemptedFetch]);

  useEffect(() => {
    if (
      user != null &&
      user.data != null &&
      user.data.fullname &&
      isConnected &&
      typeof setUser === "function"
    ) {
      setUser(user.data.email, isAdmin);
    }
  }, [user, isConnected, isAdmin]);

  return (
    <div className="chat">
      <Navbar username={user?.data?.email || "User"} isAdmin={isAdmin} />

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