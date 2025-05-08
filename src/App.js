import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { WebSocketProvider } from "./context/WebSocketContext";

// Layouts
import UserLayout from "./components/layout/user/user";
import AdminLayout from "./components/layout/admin/admin";

// Authentication
import GoogleLogin from "./pages/auth/google";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

// User Pages
import HomePage from "./pages/users/home/home";
import ChatBot from "./pages/users/chat/chatbot";
import CoursePage from "./pages/users/course/course";
import CourseDetails from "./pages/users/course/courseDetails";
import LessonDetails from "./pages/users/course/lessonDetails";
import Exercises from "./pages/users/test/exercises";
import Test from "./pages/users/test/test";
import Account from "./pages/users/account/account";

// Admin Pages
import Dashboard from "./pages/admin/dashboard";
import CoursePanel from "./pages/admin/coursePanel";
import AddCourse from "./pages/admin/course/addCourse";
import AddLesson from "./pages/admin/course/addLesson";
import EditCourse from "./pages/admin/course/editCourse";
import AddTest from "./pages/admin/course/addTest";

// Global Styles
import "./styles/Global.css";

function App() {
  const clientId = "169551551152-d80vo21jesjv7r78qlbn3or3bo0nur08.apps.googleusercontent.com";

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <WebSocketProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              {/* Các route không cần WebSocket */}
              <Route path="/login/google" element={<GoogleLogin />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Nhóm User với Layout */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<HomePage />} />
                <Route path="account" element={<Account />} />
                <Route path="chatbot" element={<ChatBot />} />
                <Route path="courses" element={<CoursePage />} />
                <Route path="courses/:id" element={<CourseDetails />} />
                <Route path="courses/:id/lesson/:lessonId" element={<LessonDetails />} />
                <Route path="courses/:id/lesson/:lessonId/test" element={<Test />} />
              </Route>

              {/* Route Exercises không nằm trong Layout */}
              <Route path="courses/:id/lesson/:lessonId/test/:testId" element={<Exercises />} />

              {/* Nhóm Admin với Layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="coursePanel" element={<CoursePanel />} />
                <Route path="coursePanel/addCourse" element={<AddCourse />} />
                <Route path="coursePanel/addCourse/:id/addLesson" element={<AddLesson />} />
                <Route path="coursePanel/addCourse/:id/addLesson/:lessonId/addTest" element={<AddTest />} />
                <Route path="coursePanel/editCourse/:id" element={<EditCourse />} />
              </Route>
            </Routes>
          </Router>
        </WebSocketProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;