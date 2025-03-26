import React from 'react';
import SearchAndFilter from './SearchAndFilter';

const CourseHeader = ({ 
  selectAll, 
  onSelectAll,
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
        <label className="select-all">
          <span>Chọn tất cả</span>
          <input 
            type="checkbox" 
            checked={selectAll}
            onChange={onSelectAll}
          />
        </label>
      </div>
    </div>
  );
};

export default CourseHeader; 