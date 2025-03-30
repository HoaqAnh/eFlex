import React from 'react';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses, selectedCourses, onSelectCourse, onPreview }) => {
  return (
    <div className="courses-grid">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          isSelected={selectedCourses.includes(course.id)}
          onSelect={onSelectCourse}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

export default CourseGrid; 