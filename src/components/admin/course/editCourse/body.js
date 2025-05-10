import React from "react";
import "../../../../styles/admin/editCourse/body.css";

const Body = ({
    courseData,
    categories,
    imagePreview,
    selectedImage,
    handleRemoveImage,
    handleImageSelect,
    handleInputChange,
    formErrors
}) => {
    return (
        <div className="editCourse-body">
            <div className="editCourse-body__form-group">
                <div className="editCourse-body__image-upload">
                    <div className="editCourse-body__image-placeholder">
                        {(imagePreview || courseData.anhMonHoc) ? (
                            <img src={imagePreview || courseData.anhMonHoc} alt="course" />
                        ) : (
                            <img src="/placeholder.png" alt="Không có ảnh" />
                        )}
                    </div>
                </div>

                <div className="editCourse-body__form-subgroup">
                    <div className="editCourse-body__form-subgroup-1">
                        <label className="editCourse-body__label">Tên khóa học *</label>
                        <input
                            className={`editCourse-body__input ${formErrors.tenMon ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Nhập tên khóa học"
                            value={courseData.tenMon || ""}
                            onChange={(e) => handleInputChange("tenMon", e.target.value)}
                        />
                    </div>
                    <div className="editCourse-body__form-subgroup-2">
                        <div className="editCourse-body__form-subgroup-2-item">
                            <label className="editCourse-body__label">Ảnh môn học</label>
                            <div className="editCourse-body__input-file-container">
                                <input
                                    type="file"
                                    id="courseImage"
                                    className="editCourse-body__input-file"
                                    onChange={handleImageSelect}
                                    style={{ display: 'none' }}
                                    accept=".jpg,.jpeg,.png"
                                />
                                <label htmlFor="courseImage" className="editCourse-body__input-file-label">
                                    {imagePreview ? "Thay đổi hình ảnh" : "Tải lên hình ảnh"}
                                </label>
                                <div className="editCourse-body__input-file-name" id="file-name-display">
                                    {selectedImage ? selectedImage.name : "Chưa có tệp nào được chọn"}
                                </div>

                                {(selectedImage || courseData.anhMonHoc) && (
                                    <button
                                        type="button"
                                        className="btn btn-section-danger"
                                        onClick={handleRemoveImage}
                                    >
                                        Gỡ ảnh
                                    </button>
                                )}

                                {formErrors.image && (
                                    <div className="editCourse-body__error-message">
                                        {formErrors.image}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="editCourse-body__form-subgroup-2-item">
                            <label className="editCourse-body__label">Danh mục *</label>
                            <select
                                className={`editCourse-body__select ${formErrors.category ? 'input-error' : ''}`}
                                value={courseData.category?.id || ""}
                                onChange={(e) => handleInputChange("category", e.target.value)}
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

            <label className="editCourse-body__label">Mô tả *</label>
            <textarea
                className={`editCourse-body__textarea ${formErrors.moTa ? 'input-error' : ''}`}
                placeholder="Nhập mô tả khóa học"
                value={courseData.moTa || ""}
                onChange={(e) => handleInputChange("moTa", e.target.value)}
            />
        </div>
    )
}

export default Body;