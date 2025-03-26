import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { useWebSocket } from "../WebSocketContext";

export const useAuth = () => {
    const navigate = useNavigate();
    const [user, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isConnected, setUser } = useWebSocket();

    const fetchUser = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const userData = await getCurrentUser();
            const roleName = userData?.data?.roleName || "";
            
            setUserData(userData);
            setIsAdmin(roleName === "admin");

            // Set user in WebSocket context if connected
            if (isConnected && userData?.data?.email) {
                setUser(userData.data.email, roleName === "admin");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setError(error.message);
            navigate("/login");
        } finally {
            setIsLoading(false);
        }
    }, [navigate, isConnected, setUser]);

    // Fetch user data on mount and when dependencies change
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setUserData(null);
        setIsAdmin(false);
        navigate("/login");
    }, [navigate]);

    return {
        user,
        isAdmin,
        username: user?.data?.username || "",
        isAuthenticated: !!user?.data,
        isLoading,
        error,
        logout
    };
};