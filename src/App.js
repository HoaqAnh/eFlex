import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginpage';
import HomePage from './pages/HomePage';
import './styles/global.css';

function App() {
  // You can add logic to check if user is authenticated
  const isAuthenticated = localStorage.getItem('user') !== null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
        />
        {/* Add more routes for other pages as needed */}
      </Routes>
    </Router>
  );
}

export default App;