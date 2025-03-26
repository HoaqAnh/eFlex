import React from 'react';

const CourseCard = ({ course, isSelected, onSelect, onPreview }) => {
  const handleCardClick = (e) => {
    // Nếu click vào checkbox, không mở preview
    if (e.target.closest('.course-checkbox')) {
      return;
    }
    onPreview(course);
  };

  return (
    <div className="course-card" onClick={handleCardClick}>
      <div className="course-image">
        <input
          type="checkbox"
          className="course-checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(course.id);
          }}
        />
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
        <span className={`status-badge ${course.status}`}>
          {course.status === 'active' ? 'Đang hoạt động' : 
           course.status === 'inactive' ? 'Đã tạm dừng' : 'Bản nháp'}
        </span>
      </div>
    </div>
  );
};

export default CourseCard; 