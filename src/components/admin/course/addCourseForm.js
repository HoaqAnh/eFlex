import React from 'react';

const CourseForm = ({ 
    courseData, 
    handleInputChange, 
    handleLessonChange, 
    handleAddLesson, 
    handleRemoveLesson 
}) => {
    return (
        <div className="add-course__form">
            <div className="add-course__content-wrapper">
                <div className="add-course__header">
                    <h2 className="add-course__title">Thêm khóa học</h2>
                </div>

                <div className="add-course__form-group">
                    <div className="add-course__image-upload">
                        <div className="add-course__image-placeholder">
                            <img src="/placeholder.png" alt="placeholder" />
                        </div>
                        <span className="add-course__image-text">Chọn ảnh (150 x 150)</span>
                    </div>

                    <div className="add-course__form-subgroup">
                        <label className="add-course__label">Tên khóa học</label>
                        <input
                            className="add-course__input"
                            type="text"
                            placeholder="Nhập tên khóa học"
                            value={courseData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                        <label className="add-course__label">Danh mục</label>
                        <select
                            className="add-course__select"
                            value={courseData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                        >
                            <option value="">Lựa chọn danh mục</option>
                            <option value="programming">Lập trình</option>
                            <option value="design">Thiết kế</option>
                            <option value="business">Kinh doanh</option>
                        </select>
                    </div>
                </div>

                <label className="add-course__label">Mô tả</label>
                <textarea
                    className="add-course__textarea"
                    placeholder="Nhập mô tả khóa học"
                    value={courseData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
            </div>
        </div>
    );
};

export default CourseForm; 