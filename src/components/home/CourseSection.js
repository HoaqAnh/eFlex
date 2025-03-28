import React from "react";
import CourseItem from "./CourseItem";
import { useCourse } from "../../hooks/useCourse";
import { useNavigate } from "react-router-dom";

const CourseSection = () => {
  const navigate = useNavigate();
  const { listCourse, currentPage, setCurrentPage, totalPages } = useCourse();

  const handleContinue = (courseId) => {
    console.log("Continue course:", courseId);
  };

  const handleJoin = (courseId) => {
    navigate(`/home/course/${courseId}`);
  };

  return (
    <div className="section section--courses">
      <h3 className="section__title">Khóa học</h3>
      <div className="section__course-list">
        {listCourse.map((course) => (
          <CourseItem
            key={course.id}
            title={course.tenMon}
            isEnrolled={course.isEnrolled}
            onContinue={() => handleContinue(course.id)}
            onJoin={() => handleJoin(course.id)}
          />
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
          }
          disabled={currentPage >= totalPages - 1}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default CourseSection;
