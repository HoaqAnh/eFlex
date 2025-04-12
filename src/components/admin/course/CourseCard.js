import React from 'react';

//images
import courseImageDefault from "../../../assets/images/downloading.png";

const CourseCard = ({ course, isSelected, onSelect, onPreview }) => {
  const handleCardClick = (e) => {
    // Nếu click vào checkbox, không mở preview
    if (e.target.closest('.course-checkbox')) {
      return;
    }
    onPreview(course);
  };

  // Xử lý trường hợp dữ liệu không đầy đủ
  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Đã tạm dừng';
      case 'draft': return 'Bản nháp';
      default: return status || 'Không xác định';
    }
  };

  // Đảm bảo rằng các thuộc tính tồn tại, nếu không thì sử dụng giá trị mặc định
  const {
    id,
    title = 'Chưa có tiêu đề',
    image,
    lessons = 0,
    exercises = 0,
    status = 'draft'
  } = course || {};

  return (
    <div className="course-card" onClick={handleCardClick}>
      <div className="course-image">
        <input
          type="checkbox"
          className="course-checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
        />
        <img 
          src={image || '/default-course-image.jpg'} 
          alt={title}
          className="course-thumbnail"
          onError={(e) => {
            e.target.src = courseImageDefault;
          }}
        />
      </div>
      <div className="course-info">
        <h3>{title}</h3>
        <p>{lessons} bài học</p>
        <p>{exercises} bài tập</p>
        <span className={`status-badge ${status?.toLowerCase()}`}>
          {getStatusText(status)}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;