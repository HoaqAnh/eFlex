import React from 'react';

const CourseCard = ({ course, onPreview }) => {
  const handleCardClick = () => {
    onPreview(course);
  };

  return (
    <div className="course-card" onClick={handleCardClick}>
      <div className="course-image">
        <img
          src={course.image || '/default-course-image.jpg'}
          alt={course.title}
          className="course-thumbnail"
        />
      </div>
      <div className="course-info">
        <h3>{course.title}</h3>
        <p>{course.lessons} bài học</p>
        <p>{course.exercises} bài tập</p>
        <span className={`status-badge ${course.status?.toLowerCase()}`}>
          {course.status === 'active' ? 'Đang hoạt động' :
            course.status === 'inactive' ? 'Đã tạm dừng' : 'Bản nháp'}
        </span>
      </div>
    </div>
  );
};

export default CourseCard; 