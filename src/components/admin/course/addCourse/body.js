import React from "react";

//hooks
import { useCategory } from "../../../../hooks/useCategory";

//styles
import "../../../../styles/admin/addCourse/body.css"

const Body = ({
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
        <div className="addCourse-body">
            <div className="addCourse-body__content">
                <div className="addCourse-body__form-group">
                    <div className="addCourse-body__image-upload">
                        <div className="addCourse-body__image-placeholder">
                            {imagePreview ? (
                                <img src={imagePreview} alt="preview" />
                            ) : (
                                <img src="/placeholder.png" alt="placeholder" />
                            )}
                        </div>
                    </div>

                    <div className="addCourse-body__form-subgroup">
                        <div className="addCourse-body__form-subgroup-1">
                            <label className="addCourse-body__label">Tên khóa học *</label>
                            <input
                                className={`addCourse-body__input ${formErrors.tenMon ? 'input-error' : ''}`}
                                type="text"
                                placeholder="Nhập tên khóa học"
                                value={courseData.tenMon || ''}
                                onChange={(e) => handleInputChange('tenMon', e.target.value)}
                            />
                        </div>
                        <div className="addCourse-body__form-subgroup-2">
                            <div className="addCourse-body__form-subgroup-2-item">
                                <label className="addCourse-body__label">Ảnh môn học</label>
                                <div className="addCourse-body__input-file-container">
                                    <input 
                                        type="file"
                                        id="courseImage"
                                        className="addCourse-body__input-file"
                                        onChange={handleImageSelect}
                                        style={{ display: 'none' }}
                                        accept=".jpg,.jpeg,.png"
                                    />
                                    <label htmlFor="courseImage" className="addCourse-body__input-file-label">
                                        Tải ảnh
                                    </label>
                                    <div className="addCourse-body__input-file-name" id="file-name-display">
                                        {selectedImage ? selectedImage.name : "Chưa có tệp nào được chọn"}
                                    </div>

                                    {selectedImage && (
                                        <button
                                            type="button"
                                            className="btn btn-section-danger"
                                            onClick={handleRemoveImage}
                                        >
                                            Hủy
                                        </button>
                                    )}

                                    {formErrors.image && (
                                        <div className="addCourse-body__error-message">
                                            {formErrors.image}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="addCourse-body__form-subgroup-2-item">
                                <label className="addCourse-body__label">Danh mục *</label>
                                <select
                                    className={`addCourse-body__select ${formErrors.category ? 'input-error' : ''}`}
                                    value={courseData.category || ''}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                >
                                    <option value="">Lựa chọn danh mục</option>
                                    {loading ? (
                                        <option value="" disabled>Đang tải danh mục...</option>
                                    ) : error ? (
                                        <option value="" disabled>Có lỗi xảy ra khi tải danh mục</option>
                                    ) : (
                                        categories?.length > 0 && categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.nameCategory}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <label className="addCourse-body__label">Mô tả *</label>
                <textarea
                    className={`addCourse-body__textarea ${formErrors.moTa ? 'input-error' : ''}`}
                    placeholder="Nhập mô tả khóa học"
                    value={courseData.moTa || ''}
                    onChange={(e) => handleInputChange('moTa', e.target.value)}
                />
            </div>
        </div>
    );
};

export default Body;