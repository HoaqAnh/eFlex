import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/AdminPanel/Navbar";

import "../../styles//Navbar.css";
import "../../styles/PanelStyles/coursePanel.css";
import "../../styles/PanelStyles/addCourse.css";

function AddCourse() {
    const navigate = useNavigate();
    const username = "Admin";
    const token = localStorage.getItem("token");
    const [courseData, setCourseData] = useState({
        name: "",
        category: "",
        description: "",
        lessons: [
            { id: 1, title: "", link: "" },
            { id: 2, title: "", link: "" }
        ]
    });

    const handleAddLesson = () => {
        setCourseData(prev => ({
            ...prev,
            lessons: [...prev.lessons, {
                id: prev.lessons.length + 1,
                title: "",
                link: ""
            }]
        }));
    };

    const handleRemoveLesson = (lessonId) => {
        setCourseData(prev => ({
            ...prev,
            lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
        }));
    };

    useEffect(() => {
        if (token == null)
            navigate("/login");
    }, [token, navigate]);

    const handleSubmit = () => {
        console.log(courseData);
    };

    return (
        <div className="add-course">
            <Navbar username={username} />
            <div className="add-course__main-content">
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
                                    onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                                />
                                <label className="add-course__label">Danh mục</label>
                                <select
                                    className="add-course__select"
                                    value={courseData.category}
                                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
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
                            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
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
                                            onChange={(e) => {
                                                const newLessons = courseData.lessons.map(l =>
                                                    l.id === lesson.id ? { ...l, link: e.target.value } : l
                                                );
                                                setCourseData({ ...courseData, lessons: newLessons });
                                            }}
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

                    <div className="add-course__actions">
                        <button className="btn btn-primary" onClick={() => navigate(-1)}>
                            Trở về
                        </button>
                        <button className="btn btn-secondary" onClick={handleSubmit}>
                            Thêm khóa học
                        </button>
                        <button className="btn btn-secondary">
                            Lưu nháp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCourse;

