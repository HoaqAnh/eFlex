import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCourse } from "../../hooks/useCourse";
import Navbar from "../../components/layout/navbar";
import Sidebar from "../../components/layout/sidebar";
import "../../styles/users/coursepage.css";
import { useWebSocket } from "../../WebSocketContext";
import { getCurrentUser } from "../../services/authService";

function CoursePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
  } = useAuth();
  const { isConnected, setUser } = useWebSocket();
  const [hasSetUser, setHasSetUser] = useState(false);
  const [user, setUserData] = useState(null);
  const {
    fetchCourseById,
    course,
    loading: courseLoading,
    error: courseError,
    resetCourse,
  } = useCourse(5, false);

  // Fetch thông tin người dùng từ useAuth
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [isAuthenticated, authLoading, navigate]);

  // Gửi thông tin người dùng qua WebSocket
  useEffect(() => {
    if (
      user?.data?.email &&
      isConnected &&
      typeof setUser === "function" &&
      !hasSetUser
    ) {
      setUser(user.data.email, user.data.roleName === "admin");
      setHasSetUser(true);
    }
  }, [user, isConnected, setUser, hasSetUser]);

  // Fetch thông tin khóa học
  useEffect(() => {
    if (id) {
      resetCourse(); // Reset state trước khi fetch khóa học mới
      fetchCourseById(id);
    }
  }, [id, fetchCourseById, resetCourse]);

  // Xử lý trạng thái loading và error từ useAuth
  if (authLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (authError) {
    return <div className="error">Có lỗi xảy ra: {authError}</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Hàm xử lý khi nhấn nút "Tham gia"
  const handleJoinCourse = () => {
    console.log(`Joining course with id: ${id}`);
  };

  return (
    <div className="course-page">
      <Navbar />
      <div className="content">
        <Sidebar />
        <main className="main">
          {courseLoading ? (
            <p className="course-loading">Đang tải thông tin khóa học...</p>
          ) : courseError ? (
            <p className="course-error">{courseError}</p>
          ) : course ? (
            <div className="course-detail">
              <h2 className="course-detail__title">{course.tenMon}</h2>
              <div className="course-detail__info">
                <p>
                  <strong>Mô tả:</strong>{" "}
                  {course.moTa || "Chưa có mô tả cho khóa học này."}
                </p>
                <p>
                  <strong>Danh mục:</strong>{" "}
                  {course.category?.nameCategory || "Chưa có danh mục."}
                </p>
                <p>
                  <strong>Người tạo:</strong>{" "}
                  {course.createdBy || "Chưa có thông tin người tạo."}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {course.ngayTao
                    ? new Date(course.ngayTao).toLocaleDateString()
                    : "Chưa có thông tin ngày tạo."}
                </p>
              </div>
              <button
                className="course-detail__button"
                onClick={handleJoinCourse}
              >
                Tham gia khóa học
              </button>
            </div>
          ) : (
            <p className="course-error">Không tìm thấy khóa học.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default CoursePage;
