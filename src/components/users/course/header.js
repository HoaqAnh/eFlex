import React from "react";
import "../../../styles/users/course/header.css";



const Header = ({ categoryData }) => {
    console.log("1---------------------Data Category:", categoryData);
    return (
        <div className="course-header">
            <div className="course-header__container">
                <div className="course-header__container-left">
                    <h1>Khóa học</h1>
                </div>
                <div className="course-header__container-right">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            className="search-input"
                        />
                    </div>
                    <div className="filter-box">
                        <select
                            className="filter-select"
                        >
                            <option value="">Tất cả</option>
                            {categoryData && Array.isArray(categoryData) && categoryData.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.nameCategory}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;