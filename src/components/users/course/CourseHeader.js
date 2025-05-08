import React from 'react';
import SearchAndFilter from './SearchAndFilter';

const CourseHeader = ({
  searchTerm,
  onSearch,
  filterOptions,
  selectedFilter,
  onFilterChange
}) => {
  return (
    <div className="course__header">
      <div className="header-left">
        <h2>Khóa học</h2>
      </div>
      <div className="header-right">
        <SearchAndFilter
        />
      </div>
    </div>
  );
};

export default CourseHeader; 