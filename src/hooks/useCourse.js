import { useState, useEffect, useCallback } from "react";
import { getAllCourse, getCourse } from "../services/CourseService";

export const useCourse = (pageSize = 5, fetchOnMount = true) => {
  const [listCourse, setListCourse] = useState([]); // Danh sách khóa học
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [course, setCourse] = useState(null); // Thông tin chi tiết của khóa học
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Lưu lỗi nếu có
  const [hasFetchedCourse, setHasFetchedCourse] = useState(false); // Kiểm soát fetch course by id
  const [hasFetchedCourses, setHasFetchedCourses] = useState(false); // Kiểm soát fetch danh sách khóa học

  // Hàm lấy danh sách khóa học
  const fetchCourses = useCallback(
    async (page) => {
      // Nếu đã fetch và có dữ liệu, không fetch lại trừ khi page thay đổi
      if (hasFetchedCourses && listCourse.length > 0 && page === currentPage) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAllCourse(page, pageSize);
        console.log("data", data);
        if (data) {
          setListCourse(data.data.result.content || []);
          setTotalPages(data.data.result.totalPages || 1);
          setHasFetchedCourses(true);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Không thể tải danh sách khóa học.");
      } finally {
        setLoading(false);
      }
    },
    [pageSize, hasFetchedCourses, listCourse, currentPage]
  );

  // Hàm lấy thông tin chi tiết khóa học theo id
  const fetchCourseById = useCallback(
    async (id) => {
      // Nếu đã fetch và course hiện tại có id trùng với id cần fetch, không fetch lại
      if (hasFetchedCourse && course?.id === parseInt(id)) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const courseData = await getCourse(id);
        if (courseData) {
          setCourse(courseData.data); // Backend trả về course trong "data"
          setHasFetchedCourse(true);
          return courseData.data;
        } else {
          throw new Error("Course not found");
        }
      } catch (error) {
        console.error("Error fetching course by id:", error);
        setError("Không thể tải thông tin khóa học.");
        setCourse(null);
        setHasFetchedCourse(false);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [hasFetchedCourse, course]
  );

  // Chỉ gọi fetchCourses nếu fetchOnMount là true
  useEffect(() => {
    if (fetchOnMount) {
      fetchCourses(currentPage);
    }
  }, [currentPage, fetchOnMount, fetchCourses]);

  // Hàm reset state (nếu cần)
  const resetCourse = useCallback(() => {
    setCourse(null);
    setHasFetchedCourse(false);
    setError(null);
  }, []);

  return {
    listCourse,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchCourses,
    course,
    fetchCourseById,
    loading,
    error,
    resetCourse,
  };
};
