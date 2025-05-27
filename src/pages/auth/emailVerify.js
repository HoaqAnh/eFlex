import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';
import TokenService from "../../services/tokenService";
import "../../styles/authentication/google-login.css";

const EmailVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authenticateWithGoogle = async () => {
            try {
                // setIsLoading(true);
                const urlParams = new URLSearchParams(location.search);
                const code = urlParams.get("token");

                if (!code) {
                    throw new Error("Không tìm thấy mã xác thực");
                }

                const response = await fetch("http://localhost:8080/api/v1/auth/verify?token=" + encodeURIComponent(code), {
                    method: "POST"
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.data?.error || "Đăng nhập thất bại");
                }

                toast.success("Xác thực thành công, vui lòng đăng nhập lại!");
                setTimeout(() => {
                    navigate("/login");
                }, Math.random() * 1000);
            } catch (err) {
                console.error("Email login error:", err);
                setError(err.message || "Đã có lỗi xảy ra trong quá trình xác thực");
                TokenService.clearTokens();
                toast.error(err.message || "Đăng nhập thất bại");
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 3000);
            }
            // } finally {
            //     setIsLoading(false);
            // }
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

export default EmailVerify;