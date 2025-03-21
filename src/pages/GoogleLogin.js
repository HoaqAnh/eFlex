import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/GoogleLogin.css';

function GoogleLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);

    useEffect(() => {
        const authenticateWithGoogle = async () => {
            try {
                // Lấy code từ URL parameters
                const urlParams = new URLSearchParams(location.search);
                const code = urlParams.get('code');

                if (!code) {
                    throw new Error('Không tìm thấy mã xác thực Google');
                }
                console.log("code: " + code);
                // Gọi API backend để xác thực
                const response = await axios.get('http://localhost:8080/api/v1/login/oauth2/code/google', { code });
                console.log("response: " + response);
                // Lưu token vào localStorage
                const accessToken = response.data.data.access_token;
                localStorage.setItem('token', accessToken);
                console.log("accessToken: " + accessToken);
                // Chuyển hướng đến trang HomePage
                navigate('/home');
            } catch (err) {
                setError(err.message || 'Đã có lỗi xảy ra trong quá trình xác thực');
                // Sau 3 giây sẽ chuyển về trang login
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        authenticateWithGoogle();
    }, [navigate, location]);

    return (
        <div className="google-login-container">
            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <p>Đang chuyển hướng về trang đăng nhập...</p>
                </div>
            ) : (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang xử lý đăng nhập...</p>
                </div>
            )}
        </div>
    );
}

export default GoogleLogin;
