import React from 'react';
import './styles/App.css';
import logo from './assets/images/logo.png';
import arcticonsCanvasStudent from './assets/images/arcticons_canvasstudent.png';

function App() {
  return (
    <div className="App">
      <div className="login-container">
        <div className="header-container">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Rất vui được gặp bạn!</h1>
        </div>
        <img src={arcticonsCanvasStudent} className="side-image" alt="Canvas Student" />
        <div className="button-container">
          <button className="google-login">Tiếp tục với Google</button>
          <p>hoặc đăng nhập bằng gmail của bạn</p>
          <div className="input-group">
            <input type="email" placeholder="Email" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Mật khẩu" />
          </div>
          <a href="#" className="forgot-password">Quên mật khẩu?</a>
          <button className="login-button">Đăng nhập</button>
          <p>Bạn chưa có tài khoản? <a href="#">Đăng ký</a></p>
        </div>
      </div>
    </div>
  );
}

export default App;
