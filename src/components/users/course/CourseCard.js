import React, { useEffect, useState } from 'react';
import { getCourseLessonCount } from '../../../services/lessonService';

const CourseCard = ({ course, onPreview }) => {
  const [lessonCount, setLessonCount] = useState({ baiHoc: 0, baiTap: 0 });

  useEffect(() => {
    const fetchLessonCount = async () => {
      const count = await getCourseLessonCount(course.id);
      setLessonCount(count);
    };
    fetchLessonCount();
  }, [course.id]);

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
        <p>{lessonCount.baiHoc} bài học</p>
        <p>{lessonCount.baiTap} bài tập</p>
        <p className="course-category">{course.category?.nameCategory || 'Chưa có danh mục'}</p>
        <span className={`status-badge ${course.status?.toLowerCase()}`}>
          {course.status === 'ACTIVE' ? 'Đang hoạt động' :
            course.status === 'INACTIVE' ? 'Đã tạm dừng' : 'Bản nháp'}
        </span>
      </div>
    </div>
  );
};

export default CourseCard; 