import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { WebSocketProvider } from "./context/WebSocketContext";

// Layouts
import UserLayout from "./components/layout/user/user";
import AdminLayout from "./components/layout/admin/admin";
import NotFoundPage from "./pages/NotFoundPage";

// Authentication
import GoogleLogin from "./pages/auth/google";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import EmailVerify from "./pages/auth/emailVerify";

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
import Dashboard from "./pages/admin/dashboard/dashboard";
import CoursePanel from "./pages/admin/course/course";
import AddCourse from "./pages/admin/course/addCourse";
import AddLesson from "./pages/admin/course/addLesson";
import EditCourse from "./pages/admin/course/editCourse";
import AddTest from "./pages/admin/course/addTest";

// Global Styles
import "./styles/Global.css";

const MainAppWithWebSocket = () => {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Nhóm User với Layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="account" element={<Account />} />
          <Route path="chatbot" element={<ChatBot />} />
          <Route path="course" element={<CoursePage />} />
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="course/:id/lesson/:lessonId" element={<LessonDetails />} />
          <Route path="course/:id/lesson/:lessonId/test" element={<Test />} />
        </Route>

        {/* Route Exercises không nằm trong Layout */}
        <Route path="course/:id/lesson/:lessonId/test/:testId" element={<Exercises />} />
        <Route path="course/:id/level-assessment" element={<Exercises />} />

        {/* Nhóm Admin với Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="course" element={<CoursePanel />} />
          <Route path="course/addCourse" element={<AddCourse />} />
          <Route path="course/addCourse/:id/addLesson" element={<AddLesson />} />
          <Route path="course/addCourse/:id/addLesson/:lessonId/addTest" element={<AddTest />} />
          <Route path="course/editCourse/:id" element={<EditCourse />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </WebSocketProvider>
  );
};

const App = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <Toaster
            position="top-center"
            reverseOrder={true}
          />
          <Routes>
            {/* Các route không cần WebSocketProvider */}
            <Route path="/login/google" element={<GoogleLogin />} />
            <Route path="/register/verify" element={<EmailVerify />} />

            <Route path="/*" element={<MainAppWithWebSocket />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;