import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";
import TokenService from '../services/tokenService';

export const useGetUserData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = TokenService.getToken();
                if (!token) {
                    console.warn("Không tìm thấy token, người dùng chưa đăng nhập");
                    return null;
                }

                if (!TokenService.isTokenValid()) {
                    console.warn("Token không hợp lệ hoặc đã hết hạn");
                    TokenService.clearTokens();
                    return null;
                }

                const result = await getCurrentUser();

                if (!result) {
                    throw new Error("No content user data");
                }

                setUserData(result.data);
            } catch (err) {
                throw new Error("Fetch user failed");
            } finally {
                setLoading(false)
            }
        };

        fetchUserData();
    }, [])

    return { loading, error, userData };
};

export default useGetUserData;
