import React, { useEffect, useState } from 'react';
import { getCourseLessonCount } from '../../../services/courseService';

const CourseCard = ({ course, isSelected, onSelect, onPreview }) => {
  const [lessonCount, setLessonCount] = useState({ baiHoc: 0, baiTap: 0 });

  useEffect(() => {
    const fetchLessonCount = async () => {
      const count = await getCourseLessonCount(course.id);
      setLessonCount(count);
    };
    fetchLessonCount();
  }, [course.id]);

  const handleCardClick = (e) => {
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
        <p>{lessonCount.baiHoc} bài học</p>
        <p>{lessonCount.baiTap} bài tập</p>
        <p className="course-category">{course.category?.nameCategory || 'Chưa có danh mục'}</p>
        <span className={`status-badge ${course.status?.toLowerCase()}`}>
          {course.status === 'active' ? 'Đang hoạt động' :
            course.status === 'inactive' ? 'Đã tạm dừng' : 'Bản nháp'}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;