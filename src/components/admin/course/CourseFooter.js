import React from 'react';

const CourseFooter = ({ onAddCourse, selectedCoursesCount, onDeleteCourses, onEditCourse }) => {
  return (
    <div className="footer-content">
      <button 
        className="btn btn-primary"
        onClick={onAddCourse}
      >
        Thêm khóa học
      </button>
      <button 
        className="btn btn-secondary"
        disabled={selectedCoursesCount !== 1}
        onClick={onEditCourse}
      >
        Chỉnh sửa
      </button>
      <button 
        className="btn btn-secondary"
        disabled={selectedCoursesCount === 0}
      >
        Bật/tắt khóa học
      </button>
      <button 
        className="btn btn-danger"
        disabled={selectedCoursesCount === 0}
        onClick={onDeleteCourses}
      >
        Xóa khóa học
      </button>
    </div>
  );
};

export default CourseFooter; 