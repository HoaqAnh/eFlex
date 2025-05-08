import React from 'react';

const SearchAndFilter = ({ searchTerm, onSearch, filterOptions, selectedFilter, onFilterChange }) => {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-box">
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Tất cả</option>
          {filterOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter; 