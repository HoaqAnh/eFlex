import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, loginService, logoutService, registerService } from "../services/authService";
import { useWebSocket } from "../context/WebSocketContext";
import { toast } from 'react-hot-toast';
import TokenService from "../services/tokenService";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);

  const shouldRedirect = useRef(false);
  const redirectPath = useRef("");

  const { isConnected, setUser } = useWebSocket();

  const fetchUser = useCallback(async () => {
    if (hasFetchedUser) {
      console.log("hasFetchedUser");
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userData = await getCurrentUser();
      if (!userData) {
        console.error("Invalid user data received");
        setIsLoading(false);
        shouldRedirect.current = true;
        redirectPath.current = "/login";
        return null;
      }

      setHasFetchedUser(true);

      if (userData) {
        const roleName = userData.data.roleName;
        setUserData(userData.data);
        if (roleName === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        if (isConnected && userData?.data?.fullname) {
          setUser(userData.data.fullname, roleName === "admin");
        }
        setIsLoading(false);
        return { roleName };
      }

      return null;
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      }, 0);
      setIsLoading(false);
      shouldRedirect.current = true;
      redirectPath.current = "/login";
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, setUser, hasFetchedUser]);

  useEffect(() => {
    let isMounted = true;
    const fetchAuth = async () => {
      if (TokenService.getToken() && location.pathname !== '/login') {
        if (!hasFetchedUser) {
          try {
            await fetchUser();
          } catch (error) {
            console.error("Fetch user failed: ", error);
          }
        }
      } else {
        setIsLoading(false);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchUser, hasFetchedUser, location.pathname]);

  useEffect(() => {
    if (shouldRedirect.current) {
      navigate(redirectPath.current, { replace: true });
      shouldRedirect.current = false;
    }
  }, [navigate, location.pathname, isLoading]);

  const handleLogin = useCallback(async (email, password) => {
    try {
      if (!email || !password) {
        toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Email không hợp lệ");
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await loginService(email, password);
      if (!response || !response.data) {
        throw new Error("Invalid login response");
      }

      const userInfo = await fetchUser();

      if (userInfo) {
        if (userInfo.roleName === "admin") {
          navigate("/admin", { replace: true });
        } else if (userInfo.roleName === "user") {
          navigate("/", { replace: true });
        } else {
          console.error("Thông tin role không hợp lệ");
        }
      }

      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);

      if (error.message.includes("Email hoặc mật khẩu không chính xác")) {
        toast.error("Email hoặc mật khẩu không chính xác");
      } else if (error.message.includes("Tài khoản của bạn đã bị khóa")) {
        toast.error("Tài khoản của bạn đã bị khóa");
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, fetchUser]);

  const handleRegister = useCallback(async (fullname, email, password, confirmPassword) => {
    try {
      if (!fullname || !email || !password || !confirmPassword) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Email không hợp lệ");
        return;
      }

      if (password.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await registerService(fullname, email, password);
      if (!response || !response.data) {
        throw new Error("Invalid registration response");
      } else if (response && response.data) {
        toast.success("Đăng ký thành công! Hãy đăng nhập lại.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);

      if (error.message.includes("Email đã tồn tại")) {
        toast.error("Email đã tồn tại");
      } else if (error.message.includes("thông tin không hợp lệ")) {
        toast.error("Thông tin đăng ký không hợp lệ");
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setUser(null, false);
      await logoutService();
      setUserData(null);
      setIsAdmin(false);
      setHasFetchedUser(false);
      toast.success("Đăng xuất thành công!");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đã có lỗi xảy ra khi đăng xuất");
    }
  }, [navigate, setUser]);

  const isAdminRoute = useCallback((path) => {
    const adminRoutes = [
      '/admin'
    ];

    return adminRoutes.some(route => path.startsWith(route));
  }, []);

  const checkAuth = useCallback(() => {
    if (isLoading) {
      return {
        shouldRender: false,
        component: <div className="loading">Đang tải...</div>
      };
    }

    if (error) {
      return {
        shouldRender: false,
        component: <div className="error">Có lỗi xảy ra: {error}</div>
      };
    }

    const token = TokenService.getToken();
    if (!token || !TokenService.isTokenValid()) {
      shouldRedirect.current = true;
      redirectPath.current = "/login";
      return {
        shouldRender: false,
        component: <div className="loading">Đang chuyển đến trang đăng nhập...</div>
      };
    }

    // Kiểm tra quyền admin cho các trang admin
    const currentPath = location.pathname;
    if (isAdminRoute(currentPath) && !isAdmin) {
      setTimeout(() => {
        toast.error("Bạn không có quyền truy cập trang này");
      }, 200);
      shouldRedirect.current = true;
      redirectPath.current = "/";
      return {
        shouldRender: false,
        component: <div className="loading">Bạn không có quyền truy cập. Đang chuyển hướng...</div>
      };
    }

    return { shouldRender: true };
  }, [isLoading, error, isAdmin, location.pathname, isAdminRoute]);

  const requireAdmin = useCallback(() => {
    if (isLoading) {
      return {
        isAllowed: false,
        component: <div className="loading">Đang tải...</div>
      };
    }

    if (!isAdmin) {
      setTimeout(() => {
        toast.error("Bạn không có quyền truy cập trang này");
      }, 0);
      shouldRedirect.current = true;
      redirectPath.current = "/";
      return {
        isAllowed: false,
        component: <div className="loading">Bạn không có quyền truy cập. Đang chuyển hướng...</div>
      };
    }

    return { isAllowed: true };
  }, [isAdmin, isLoading]);

  return {
    user,
    isAdmin,
    isLoading,
    error,
    logout,
    handleLogin,
    handleRegister,
    checkAuth,
    requireAdmin,
    isAdminRoute
  };
};