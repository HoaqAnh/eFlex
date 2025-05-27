import "../../../../styles/admin/addCourse/body.css"

const Body = ({ formData, categories, imagePreview, selectedImage,
    handleInputChange, handleImageSelect, handleRemoveImage, formErrors
}) => {
    return (
        < div className="addCourse-body" >
            <div className="addCourse-body__form-group">
                <div className="addCourse-body__image-upload">
                    <div className="addCourse-body__image-placeholder">
                        {(imagePreview || formData?.anhMonHoc) ? (
                            <img src={imagePreview || formData.anhMonHoc} alt="preview" />
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
                            value={formData?.tenMon || ''}
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
                                    {selectedImage ? selectedImage.name : (formData?.anhMonHoc ? "Ảnh hiện tại" : "Chưa có tệp nào được chọn")}
                                </div>

                                {selectedImage && (
                                    <button
                                        type="button"
                                        className="btn btn-section-danger"
                                        onClick={handleRemoveImage}
                                    >
                                        Hủy ảnh mới
                                    </button>
                                )}

                                {!selectedImage && formData?.anhMonHoc && (
                                    <button
                                        type="button"
                                        className="btn btn-section-danger"
                                        onClick={handleRemoveImage}
                                    >
                                        Xóa ảnh hiện tại
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
                                value={formData?.category || ''}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                            >
                                <option value="">Lựa chọn danh mục</option>
                                {categories?.length > 0 && categories.map((category) => (
                                    <option key={category.id} value={category.id.toString()}>
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
                value={formData?.moTa || ''}
                onChange={(e) => handleInputChange('moTa', e.target.value)}
            />
        </div >
    );
}
export default Body;