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
    <div className="course-panel__header">
      <div className="header-left">
        <h2>Khóa học</h2>
      </div>
      <div className="header-right">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearch={onSearch}
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
};

export default CourseHeader; 