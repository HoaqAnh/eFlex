import React, { useState, useEffect, useRef } from "react";
import Message from "./ChatMessage";
import { ChatBot } from "../../../services/ChatService";

//style
import "../../../styles/users/chatbot/chat-content.css";

const ChatContent = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
        setMessages(
          parsedHistory.map((msg) => ({
            content: msg.message,
            sender: msg.FromUser ? "user" : "bot",
            time: msg.time,
          }))
        );
      } catch (e) {
        console.error("Error parsing chat history:", e);
      }
    }
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    setIsLoading(true);

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = {
      content: input,
      sender: "user",
      time: userTime,
    };
    setMessages((prev) => [...prev, userMessage]);

    const updatedChatHistory = [
      ...chatHistory,
      { FromUser: true, message: input, time: userTime },
    ];
    setChatHistory(updatedChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));

    try {
      const result = await ChatBot(input, updatedChatHistory);
      setIsLoading(false);

      if (result.success) {
        const botTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const botMessage = {
          content: result.data.data.messageInMarkdown || "Không có phản hồi.",
          sender: "bot",
          time: botTime,
        };
        setMessages((prev) => [...prev, botMessage]);

        const updatedChatHistoryWithBot = [
          ...updatedChatHistory,
          { FromUser: false, message: botMessage.content, time: botTime },
        ];
        setChatHistory(updatedChatHistoryWithBot);
        localStorage.setItem(
          "chatHistory",
          JSON.stringify(updatedChatHistoryWithBot)
        );
      } else {
        const errorTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const errorMessage = {
          content: result.error || "Có lỗi xảy ra khi gọi bot.",
          sender: "bot",
          time: errorTime,
        };
        setMessages((prev) => [...prev, errorMessage]);

        const updatedChatHistoryWithError = [
          ...updatedChatHistory,
          { FromUser: false, message: errorMessage.content, time: errorTime },
        ];
        setChatHistory(updatedChatHistoryWithError);
        localStorage.setItem(
          "chatHistory",
          JSON.stringify(updatedChatHistoryWithError)
        );
      }
    } catch (error) {
      setIsLoading(false);
      const errorTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const errorMessage = {
        content: "Có lỗi xảy ra khi kết nối với server.",
        sender: "bot",
        time: errorTime,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch sử chat?")) {
      setMessages([]);
      setChatHistory([]);
      localStorage.removeItem("chatHistory");
    }
  };

  return (
    <div className="chat-content">
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            sender={message.sender}
            time={message.time}
          />
        ))}

        {isLoading && (
          <div className="message-wrapper bot">
            <div className="message">
              <p>eFlex bot đang trả lời...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Hỏi bất cứ điều gì về học tập của bạn"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20.04 2.323c1.016-.355 1.992.621 1.637 1.637l-5.925 16.93c-.385 1.098-1.915 1.16-2.387.097l-2.859-6.432l4.024-4.025a.75.75 0 0 0-1.06-1.06l-4.025 4.024l-6.432-2.859c-1.063-.473-1-2.002.097-2.387z" />
            </svg>
          </button>
          <button
            className="clear-history-button"
            onClick={clearChatHistory}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;