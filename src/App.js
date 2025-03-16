import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ChatBot from "./pages/ChatPage"
import "./styles/Global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatBot />} />
        {/* Add more routes for other pages as needed */}
      </Routes>
    </Router>
  );
}

export default App;
