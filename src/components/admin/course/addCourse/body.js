import React from "react";
import "../../../../styles/admin/addCourse/body.css"

const Body = ({
    courseDetail,
    categories,
    handleInputChange,
    imagePreview,
    handleImageSelect,
    handleRemoveImage,
    selectedImage,
    formErrors
}) => {
    return (
        <div className="addCourse-body">
            <div className="addCourse-body__form-group">
                <div className="addCourse-body__image-upload">
                    <div className="addCourse-body__image-placeholder">
                        {(imagePreview || courseDetail?.anhMonHoc) ? (
                            <img src={imagePreview || courseDetail.anhMonHoc} alt="preview" />
                        ) : (
                            <img src="/placeholder.png" alt="placeholder" />
                        )}
                    </div>
                </div>

                <div className="addCourse-body__form-subgroup">
                    <div className="addCourse-body__form-subgroup-1">
                        <label className="addCourse-body__label">Tên khóa học *</label>
                        <input
                            className={`addCourse-body__input ${formErrors?.tenMon ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Nhập tên khóa học"
                            value={courseDetail?.tenMon}
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

                                {formErrors?.image && (
                                    <div className="addCourse-body__error-message">
                                        {formErrors?.image}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="addCourse-body__form-subgroup-2-item">
                            <label className="addCourse-body__label">Danh mục *</label>
                            <select
                                className={`addCourse-body__select ${formErrors?.category ? 'input-error' : ''}`}
                                // value={courseDetail?.category.id}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                            >
                                <option value="">Lựa chọn danh mục</option>
                                {categories?.length > 0 && categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.nameCategory}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <label className="addCourse-body__label">Mô tả *</label>
            <textarea
                className={`addCourse-body__textarea ${formErrors?.moTa ? 'input-error' : ''}`}
                placeholder="Nhập mô tả khóa học"
                value={courseDetail?.moTa}
                onChange={(e) => handleInputChange('moTa', e.target.value)}
            />
        </div>
    );
};

export default Body;