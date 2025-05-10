import React from "react";
import "../../../styles/users/course/skeleton.css";

const SkeletonItem = () => {
  return (
    <div className="skeleton-item">
      <div className="skeleton-thumbnail pulse"></div>
      <div className="skeleton-info">
        <div className="skeleton-title pulse"></div>
        <div className="skeleton-category pulse"></div>
        <div className="skeleton-details pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonItem;