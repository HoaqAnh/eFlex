import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'react-feather';
import '../styles/ChatContent.css';

const ChatContent = ({ messages, onSendMessage, onClearHistory }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-content">
      <div className="chat-content__messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'message--user' : 'message--bot'}`}
          >
            <div className="message__content">
              {message.content}
            </div>
            <span className="message__time">{formatTime(message.timestamp)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-footer">
        <div className="chat-footer__input-container">
          <div className="chat-footer__input-wrapper">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="chat-footer__input"
            />
          </div>
          <button
            className="chat-footer__button"
            onClick={handleSubmit}
            disabled={!newMessage.trim()}
          >
            <Send className="chat-footer__button-icon" />
          </button>
          <button
            className="chat-footer__clear-button"
            onClick={onClearHistory}
          >
            Clear History
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatContent; 