import { useNavigate } from "react-router-dom";

//hooks
import { useAuth } from "../../hooks/useAuth";

//components
import Navbar from "../../components/navbar";
import Sidebar from "../../components/users/layout/sidebar";
import ChatContent from "../../components/users/chatbot/ChatContent";

//style
import "../../styles/users/chatbot/chatbot.css";

function ChatPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">Có lỗi xảy ra: {error}</div>;
  }

  if (!isAuthenticated) {
    navigate("/login");
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