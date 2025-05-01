import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

//authentication
import GoogleLogin from "./pages/auth/google";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

//user
import HomePage from "./pages/users/home";
import ChatBot from "./pages/users/chatbot";
import CoursePage from "./pages/users/course";
import CourseDetails from "./pages/users/courseDetails";
import LessonDetails from "./pages/users/lessonDetails";
import Exercises from "./pages/users/exercises";

//admin
import Dashboard from "./pages/admin/dashboard";
import CoursePanel from "./pages/admin/coursePanel";
import AddCourse from "./pages/admin/course/addCourse";
import AddLesson from "./pages/admin/course/addLesson";
import EditCourse from "./pages/admin/course/editCourse";
import AddTest from "./pages/admin/course/addTest";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* user */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/courses/:id/lesson/:lessonId" element={<LessonDetails />} />
        <Route path="/courses/:id/lesson/:lessonId/exercises" element={<Exercises />} />

        {/* admin */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coursePanel" element={<CoursePanel />} />
        <Route path="/coursePanel/addCourse" element={<AddCourse />} />
        <Route path="/coursePanel/addCourse/:id/addLesson" element={<AddLesson />} />
        <Route path="/coursePanel/addCourse/:id/addLesson/:lessonId/addTest" element={<AddTest />} />
        <Route path="/coursePanel/editCourse/:id" element={<EditCourse />} />
      </Routes>
    </WebSocketProvider>
  );
}

function App() {
  const clientId =
    "169551551152-d80vo21jesjv7r78qlbn3or3bo0nur08.apps.googleusercontent.com";

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Các route không cần WebSocket */}
            <Route path="/login/google" element={<GoogleLogin />} />

            {/* Nhóm các route cần WebSocket */}
            <Route path="/*" element={<WebSocketRoutes />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
