import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ChatBot from "./pages/ChatPage";

import GoogleLogin from "./pages/GoogleLogin";

import HomePanel from "./pages/AdminPanel/HomePanel";
import CoursePanel from "./pages/AdminPanel/coursePanel";
import AddCourse from "./pages/AdminPanel/addCourse";

import "./styles/Global.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { WebSocketProvider } from "./WebSocketContext";

// Component trung gian để nhóm các route cần WebSocket
function WebSocketRoutes() {
  return (
    <WebSocketProvider>
      {" "}
      {/* Bọc WebSocketProvider chỉ xung quanh các route cần WebSocket */}
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/homePanel" element={<HomePanel />} />
        <Route path="/coursePanel" element={<CoursePanel />} />
        <Route path="/coursePanel/addCourse" element={<AddCourse />} />
      </Routes>
    </WebSocketProvider>
  );
}

function App() {
  const clientId =
    "169551551152-d80vo21jesjv7r78qlbn3or3bo0nur08.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          {/* Các route không cần WebSocket */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/google" element={<GoogleLogin />} />

          {/* Nhóm các route cần WebSocket */}
          <Route path="/*" element={<WebSocketRoutes />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;