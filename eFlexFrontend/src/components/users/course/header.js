import "../../../styles/users/course/header.css";

const Header = ({ categoryData, onCategoryChange, selectedCategoryId, searchTerm, onSearchChange }) => {
    const handleSelectChange = (event) => {
        if (onCategoryChange) {
            onCategoryChange(event.target.value);
        }
    };
    
    const handleInputChange = (event) => {
        if (onSearchChange) {
            onSearchChange(event.target.value);
        }
    };

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
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="filter-box"> 
                        <select
                            className="filter-select"
                            onChange={handleSelectChange}
                            value={selectedCategoryId === null ? "" : selectedCategoryId}
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