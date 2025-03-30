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

                <div className="add-course__lessons">
                    <label className="add-course__label">Nội dung bài học</label>
                    <div className="add-course__lessons-list">
                        {courseData.lessons.map((lesson) => (
                            <div key={lesson.id} className="add-course__lesson">
                                <span className="add-course__lesson-number">Bài {lesson.id}</span>
                                <button className="add-course__lesson-type">Nhập bài tập</button>
                                <button
                                    className="add-course__lesson-remove"
                                    onClick={() => handleRemoveLesson(lesson.id)}
                                >
                                    −
                                </button>
                                <input
                                    className="add-course__input add-course__lesson-input"
                                    type="text"
                                    placeholder="Nhập đường dẫn đến bài học"
                                    value={lesson.link}
                                    onChange={(e) => handleLessonChange(lesson.id, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="add-course__add-lesson-wrapper">
                            <button className="add-course__add-lesson" onClick={handleAddLesson}>
                                <span className="add-course__add-lesson-icon">+</span>
                                <span>Thêm bài học</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseForm; 