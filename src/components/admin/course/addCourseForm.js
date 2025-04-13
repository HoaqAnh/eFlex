import React from 'react';
import { useCategory } from '../../../hooks/useCategory';

const CourseForm = ({
    courseData,
    handleInputChange,
    imagePreview,
    handleImageSelect,
    handleRemoveImage,
    selectedImage,
    formErrors
}) => {
    const { categories, loading, error } = useCategory();

    return (
        <div className="add-course__form">
            <div className="add-course__content-wrapper">
                <div className="add-course__header">
                    <h2 className="add-course__title">Thêm khóa học</h2>
                </div>

                <div className="add-course__form-group">
                    <div className="add-course__image-upload">
                        <div className="add-course__image-placeholder">
                            {imagePreview ? (
                                <img src={imagePreview} alt="preview" />
                            ) : (
                                <img src="/placeholder.png" alt="placeholder" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="courseImage"
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="courseImage" className="add-course__image-text">
                            Chọn ảnh (150 x 150)
                        </label>
                    </div>

                    <div className="add-course__form-subgroup">
                        <label className="add-course__label">Tên khóa học *</label>
                        <input
                            className={`add-course__input ${formErrors.tenMon ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Nhập tên khóa học"
                            value={courseData.tenMon || ''}
                            onChange={(e) => handleInputChange('tenMon', e.target.value)}
                        />
                        {formErrors.tenMon && (
                            <span className="error-message">{formErrors.tenMon}</span>
                        )}
                        <label className="add-course__label">Danh mục *</label>
                        <select
                            className={`add-course__select ${formErrors.category ? 'input-error' : ''}`}
                            value={courseData.category || ''}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                        >
                            <option value="">Lựa chọn danh mục</option>
                            {loading ? (
                                <option value="" disabled>Đang tải danh mục...</option>
                            ) : error ? (
                                <option value="" disabled>Có lỗi xảy ra khi tải danh mục</option>
                            ) : (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.nameCategory}
                                    </option>
                                ))
                            )}
                        </select>
                        {formErrors.category && (
                            <span className="error-message">{formErrors.category}</span>
                        )}
                    </div>
                </div>

                <label className="add-course__label">Mô tả *</label>
                <textarea
                    className={`add-course__textarea ${formErrors.moTa ? 'input-error' : ''}`}
                    placeholder="Nhập mô tả khóa học"
                    value={courseData.moTa || ''}
                    onChange={(e) => handleInputChange('moTa', e.target.value)}
                />
                {formErrors.moTa && (
                    <span className="error-message">{formErrors.moTa}</span>
                )}
            </div>
        </div>
    );
};

export default CourseForm;