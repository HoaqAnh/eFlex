import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const stompClientRef = useRef(null);
  const hasSentInitialMessage = useRef(false);
  const hasSentJoinMessage = useRef(false);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      // debug: (str) => console.log(str),
    });

    stompClientRef.current = stompClient;

    stompClient.onConnect = (frame) => {
      // console.log("WebSocket Connected: " + frame);
      setIsConnected(true);

      stompClient.subscribe("/topic/public", (message) => {
        try {
          const response = JSON.parse(message.body);
          // console.log("Received message from /topic/public:", response);
          if (response && typeof response.activeUsers === "number") {
            setActiveUsers(response.activeUsers);
          } else {
            console.error("Invalid response format:", response);
          }
        } catch (error) {
          console.error("Error parsing message body:", error);
        }
      });

      // Gửi getActiveUsers
      if (!hasSentInitialMessage.current) {
        stompClient.publish({
          destination: "/app/chat.getActiveUsers",
          body: JSON.stringify({}),
        });
        hasSentInitialMessage.current = true;
      }
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      setIsConnected(false);
      hasSentInitialMessage.current = false;
      hasSentJoinMessage.current = false;
    };

    stompClient.onWebSocketError = (event) => {
      console.error("WebSocket error:", event);
      setIsConnected(false);
      hasSentInitialMessage.current = false;
      hasSentJoinMessage.current = false;
    };

    stompClient.onWebSocketClose = () => {
      // console.log("WebSocket connection closed");
      setIsConnected(false);
      hasSentInitialMessage.current = false;
      hasSentJoinMessage.current = false;

      if (
        userInfo &&
        stompClientRef.current &&
        stompClientRef.current.connected
      ) {
        stompClientRef.current.publish({
          destination: "/app/chat.disconnectUser",
          body: JSON.stringify({
            sender: userInfo.fullname,
            type: "LEAVE",
            isAdmin: userInfo.isAdmin,
          }),
        });
        // console.log("User LEAVE message sent successfully");
      }
    };

    stompClient.activate();

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        if (userInfo) {
          stompClientRef.current.publish({
            destination: "/app/chat.disconnectUser",
            body: JSON.stringify({
              sender: userInfo.fullname,
              type: "LEAVE",
              isAdmin: userInfo.isAdmin,
            }),
          });
          // console.log("User LEAVE message sent successfully");
        }
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        setIsConnected(false);
        hasSentInitialMessage.current = false;
        hasSentJoinMessage.current = false;
      }
    };
  }, []);

  // Gửi JOIN khi userInfo thay đổi
  useEffect(() => {
    if (
      userInfo &&
      isConnected &&
      stompClientRef.current &&
      stompClientRef.current.connected &&
      !hasSentJoinMessage.current
    ) {
      stompClientRef.current.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({
          sender: userInfo.fullname,
          type: "JOIN",
          isAdmin: userInfo.isAdmin,
        }),
      });
      // console.log("User JOIN message sent successfully:", userInfo);
      hasSentJoinMessage.current = true;
    }
  }, [userInfo, isConnected]);

  const setUser = (fullname, isAdmin) => {
    setUserInfo({ fullname, isAdmin });
  };

  return (
    <WebSocketContext.Provider value={{ activeUsers, isConnected, setUser }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
