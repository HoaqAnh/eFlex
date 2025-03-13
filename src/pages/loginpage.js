import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import eFlexLogo from '../assets/images/logo_app.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle email/password login
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Here you would add your authentication logic
    console.log('Logging in with:', email, password);
    
    // For now, let's just simulate a successful login
    localStorage.setItem('user', JSON.stringify({ email }));
    navigate('/');
  };

  // Function to handle Google login
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    
    // After successful Google authentication:
    // localStorage.setItem('user', JSON.stringify({ email: 'user@example.com' }));
    // navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-header">
          <img src={eFlexLogo} alt="eFlex Logo" className="logo" />
          <h2>Rất vui được gặp bạn!</h2>
        </div>
        
        <div className="login-main">
          <div className="login-form-section">
            <p>Tiếp tục với</p>
            
            <button className="google-login-btn" onClick={handleGoogleLogin}>
              <img src={require('../assets/images/logo_google.png')} alt="Google" />
            </button>
            
            <div className="divider">
              <span>hoặc đăng nhập bằng gmail của bạn</span>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <div className="input-icon">
                <img src={require('../assets/images/icon_mail.png')} className = "icon_mail" alt="X" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-icon">
                <img src={require('../assets/images/icon_password.png')} className = "icon_password" alt="X" />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="forgot-password">
                <a href="#">Quên mật khẩu?</a>
              </div>
              
              <button type="submit" className="login-btn">Đăng nhập</button>
            </form>
            
            <p className="register-prompt">
              Bạn chưa có tài khoản? <a href="#">Đăng ký</a>
            </p>
          </div>
          
          <div className="login-illustration">
            {/* This would be your colorful circular logo from the image */}
            <div className="circles-illustration"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;