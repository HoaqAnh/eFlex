import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//authentication
import GoogleLogin from "./pages/authentication/google";
import LoginPage from "./pages/authentication/login";

//user
import HomePage from "./pages/users/home";
import ChatBot from "./pages/users/chatbot";
import CoursePage from "./pages/users/course";

//admin
import Dashboard from "./pages/admin/dashboard";
import CoursePanel from "./pages/admin/coursePanel";
import AddCourse from "./pages/admin/addCourse";
import AddLesson from "./pages/admin/addLesson";
//style
import "./styles/Global.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { WebSocketProvider } from "./WebSocketContext";

// Component trung gian để nhóm các route cần WebSocket
function WebSocketRoutes() {
  return (
    <WebSocketProvider>
      {/* Bọc WebSocketProvider chỉ xung quanh các route cần WebSocket */}
      <Routes>
        {/* user */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/courses" element={<CoursePage />} />

        {/* admin */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coursePanel" element={<CoursePanel />} />
        <Route path="/coursePanel/addCourse" element={<AddCourse />} />
        <Route path="/coursePanel/addCourse/addLesson" element={<AddLesson />} />
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
