import React from "react";

//styles
import "../../../../styles/admin/editCourse/body.css";

function Body() {
    return (
        <div className="editCourse-body">
            <div className="editCourse-body__content">
                <div className="editCourse-body__form-group">
                    <div className="editCourse-body__image-upload">
                        <div className="editCourse-body__image-placeholder">
                            <img src="/placeholder.png" alt="placeholder" />
                        </div>
                    </div>

                    <div className="editCourse-body__form-subgroup">
                        <div className="editCourse-body__form-subgroup-1">
                            <label className="editCourse-body__label">Tên khóa học *</label>
                            <input
                                className="editCourse-body__input"
                                type="text"
                                placeholder="Nhập tên khóa học"
                            />
                        </div>
                        <div className="editCourse-body__form-subgroup-2">
                            <div className="editCourse-body__form-subgroup-2-item">
                                <label className="editCourse-body__label">Ảnh môn học</label>
                                <div className="editCourse-body__input-file-container">
                                    <input type="file" id="courseImage" className="editCourse-body__input-file" />
                                    <label htmlFor="courseImage" className="editCourse-body__input-file-label">Tải lên hình ảnh</label>
                                    <div className="editCourse-body__input-file-name" id="file-name-display">Chưa có tệp nào được chọn</div>
                                </div>
                            </div>
                            <div className="editCourse-body__form-subgroup-2-item">
                                <label className="editCourse-body__label">Danh mục *</label>
                                <select className="editCourse-body__select">
                                    <option value="">Lựa chọn danh mục</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <label className="editCourse-body__label">Mô tả *</label>
                <textarea
                    className="editCourse-body__textarea"
                    placeholder="Nhập mô tả khóa học" />
            </div>
        </div>
    );
};
export default Body;
