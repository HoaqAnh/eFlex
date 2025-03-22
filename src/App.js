import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/loginpage";
import HomePage from "./pages/HomePage";
import ChatBot from "./pages/ChatPage";
import HomePanel from "./pages/AdminPanel/HomePanel";
import CoursePanel from "./pages/AdminPanel/coursePanel";
import AddCourse from "./pages/AdminPanel/addCourse";
import GoogleLogin from "./pages/GoogleLogin";
import "./styles/global.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId =
    "169551551152-d80vo21jesjv7r78qlbn3or3bo0nur08.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/homePanel" element={<HomePanel />} />
          <Route path="/coursePanel" element={<CoursePanel />} />
          <Route path="/coursePanel/addCourse" element={<AddCourse />} />
          <Route path="/login/google" element={<GoogleLogin />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
