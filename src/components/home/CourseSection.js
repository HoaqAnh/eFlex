import React from 'react';
import CourseItem from './CourseItem';
import { useCourse } from '../../hooks/useCourse';

const CourseSection = () => {
  const { listCourse } = useCourse();

  const handleContinue = (courseId) => {
    // Xử lý logic tiếp tục khóa học
    console.log('Continue course:', courseId);
  };

  const handleJoin = (courseId) => {
    // Xử lý logic tham gia khóa học
    console.log('Join course:', courseId);
  };

  return (
    <div className="section section--courses">
      <h3 className="section__title">Khóa học</h3>
      <div className="section__course-list">
        {listCourse.map((course) => (
          <CourseItem
            key={course.id}
            title={course.title}
            isEnrolled={course.isEnrolled}
            onContinue={() => handleContinue(course.id)}
            onJoin={() => handleJoin(course.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSection; 