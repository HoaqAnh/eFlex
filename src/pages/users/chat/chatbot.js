import { useAuth } from "../../../hooks/useAuth";
import ChatContent from "../../../components/users/chatbot/ChatContent";
import "../../../styles/users/chatbot/chatbot.css";

const ChatPage = () => {
  const { checkAuth } = useAuth();
  const authCheck = checkAuth();

  if (!authCheck.shouldRender) {
    return authCheck.component;
  }

  return (
    <div className="chat">
      <ChatContent />
    </div>
  );
}

export default ChatPage;