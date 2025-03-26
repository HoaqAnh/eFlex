import React from 'react';

const CourseItem = ({ title, isEnrolled, onContinue, onJoin }) => {
  return (
    <div className="course-item">
      <h4 className="course-item__title">{title}</h4>
      {isEnrolled ? (
        <button 
          className="course-item__button course-item__button--continue"
          onClick={onContinue}
        >
          Tiếp tục
        </button>
      ) : (
        <button 
          className="course-item__button course-item__button--join"
          onClick={onJoin}
        >
          Tham gia
        </button>
      )}
    </div>
  );
};

export default CourseItem; 