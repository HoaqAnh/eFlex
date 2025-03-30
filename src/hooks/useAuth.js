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
  const [hasFetchedUser, setHasFetchedUser] = useState(false);

  const { isConnected, setUser } = useWebSocket();

  const fetchUser = useCallback(async () => {
    if (hasFetchedUser && user?.data) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token in localStorage, redirecting to login");
        navigate("/login");
        return;
      }

      const userData = await getCurrentUser();
      if (!userData || !userData.data) {
        console.error("Invalid user data received");
        throw new Error("Invalid user data");
      }

      const roleName = userData?.data?.roleName || "";
      setUserData(userData);
      setIsAdmin(roleName === "admin");
      setHasFetchedUser(true);

      if (isConnected && userData?.data?.email) {
        setUser(userData.data.email, roleName === "admin");
      }
    } catch (error) {
      console.error("Error in fetchUser:", error);
      setError(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, isConnected, setUser, hasFetchedUser, user?.data]);

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsAdmin(false);
    setHasFetchedUser(false);
    navigate("/login");
  }, [navigate]);

  return {
    user,
    isAdmin,
    username: user?.data?.fullname || "",
    isAuthenticated: !!user?.data,
    isLoading,
    error,
    logout,
  };
};
