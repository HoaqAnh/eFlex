import React from "react";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../../../context/ThemeContext";

const ChatMessage = ({ content, sender, time }) => {
  const { theme } = useTheme();
  return (
    <div className={`message-wrapper ${sender}`}>
      <div className="message">
        <ReactMarkdown
          children={content}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={theme === "light" ? oneLight : oneDark}
                  language={match[1]}
                  PreTag="pre"
                  wrapLongLines={true}
                  {...props}
                >
                  {String(children).trim()}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {String(children).trim()}
                </code>
              );
            },
          }}
        />
      </div>
      <span>{time}</span>
      {sender === "bot" && (
        <div className="response-info">
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
