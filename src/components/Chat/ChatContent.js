import React, { useState, useEffect, useRef } from "react";
import Message from "./ChatMessage";
import { ChatBot } from "../../services/ChatService";
import "../../styles/ChatContent.css";

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
              placeholder="Xin chào, tôi có thể giúp gì cho bạn?"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="m6.998 10.247l.435.76c.277.485.415.727.415.993s-.138.508-.415.992l-.435.761c-1.238 2.167-1.857 3.25-1.375 3.788c.483.537 1.627.037 3.913-.963l6.276-2.746c1.795-.785 2.693-1.178 2.693-1.832s-.898-1.047-2.693-1.832L9.536 7.422c-2.286-1-3.43-1.5-3.913-.963s.137 1.62 1.375 3.788Z" />
            </svg>
          </button>
          <button 
            className="clear-history-button" 
            onClick={clearChatHistory}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;