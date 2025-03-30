import React from 'react';

const PreviewCourse = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="preview-course-overlay">
      <div className="preview-course-modal">
        <div className="preview-course-header">
          <h2>Xem trước khóa học</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="preview-course-content">
          <div className="preview-course-image">
            <img src={course.image || '/default-course-image.jpg'} alt={course.title} />
          </div>
          
          <div className="preview-course-info">
            <h3>{course.title}</h3>
            <div className="preview-course-stats">
              <p><span className="stat-label">Số bài học:</span> {course.lessons}</p>
              <p><span className="stat-label">Số bài tập:</span> {course.exercises}</p>
              <p><span className="stat-label">Trạng thái:</span> 
                <span className={`status-badge ${course.status}`}>
                  {course.status === 'active' ? 'Đang hoạt động' : 
                   course.status === 'inactive' ? 'Đã tạm dừng' : 'Bản nháp'}
                </span>
              </p>
            </div>
            
            <div className="preview-course-description">
              <h4>Mô tả khóa học</h4>
              <p>{course.description || 'Chưa có mô tả chi tiết.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCourse; 