import React, { useEffect } from "react";
import CourseItem from "./CourseItem";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../../hooks/users/useCourses";

const CourseSection = () => {
  const navigate = useNavigate();
  const { listCourse, fetchCourses, loading, error } = useCourses();

  useEffect(() => {
    fetchCourses(1); // Gọi API lấy danh sách khóa học khi component mount
  }, [fetchCourses]);

  const handleContinue = (courseId) => {
    console.log("Continue course:", courseId);
  };

  const handleJoin = (courseId) => {
    navigate(`/home/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="section section--courses">
        <h3 className="section__title">Khóa học</h3>
        <div className="loading">Đang tải danh sách khóa học...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section section--courses">
        <h3 className="section__title">Khóa học</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="section section--courses">
      <h3 className="section__title">Khóa học</h3>
      <div className="section__course-list">
        {listCourse && listCourse.length > 0 ? (
          listCourse.map((course) => (
            <CourseItem
              key={course.id}
              title={course.tenMon}
              description={course.moTa}
              image={course.hinhAnh}
              isEnrolled={course.isEnrolled}
              onContinue={() => handleContinue(course.id)}
              onJoin={() => handleJoin(course.id)}
            />
          ))
        ) : (
          <div className="no-courses">Không có khóa học nào</div>
        )}
      </div>
    </div>
  );
};

export default CourseSection;
