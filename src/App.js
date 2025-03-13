import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/loginpage";
import HomePage from "./pages/HomePage";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Add more routes for other pages as needed */}
      </Routes>
    </Router>
  );
}

export default App;
