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

    useEffect(() => {
        if (token == null)
            navigate("/login");
    }, [token, navigate]);

    const handleSubmit = () => {
        // Xử lý logic submit form
        console.log(courseData);
    };

    return (
        <div className="add-course-container">
            <Navbar username={username} />
            <div className="main-content">
                <div className="add-course-content">
                    <h1>Thêm khóa học</h1>
                    <div className="course-form">
                        <div className="image-upload">
                            <div className="image-placeholder">
                                <img src="/placeholder.png" alt="placeholder" />
                            </div>
                            <span>Chọn ảnh (150 x 150)</span>
                        </div>

                        <div className="form-group">
                            <label>Tên khóa học</label>
                            <input 
                                type="text" 
                                placeholder="Nhập tên khóa học"
                                value={courseData.name}
                                onChange={(e) => setCourseData({...courseData, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Danh mục</label>
                            <select 
                                value={courseData.category}
                                onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                            >
                                <option value="">Lựa chọn danh mục</option>
                                <option value="programming">Lập trình</option>
                                <option value="design">Thiết kế</option>
                                <option value="business">Kinh doanh</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea 
                                placeholder="Nhập mô tả khóa học"
                                value={courseData.description}
                                onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                            />
                        </div>

                        <div className="lessons-section">
                            <label>Nội dung bài học</label>
                            {courseData.lessons.map((lesson, index) => (
                                <div key={lesson.id} className="lesson-item">
                                    <span className="lesson-number">Bài {lesson.id}</span>
                                    <button className="lesson-type">Bài tập</button>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập đường dẫn đến bài học"
                                        value={lesson.link}
                                        onChange={(e) => {
                                            const newLessons = [...courseData.lessons];
                                            newLessons[index].link = e.target.value;
                                            setCourseData({...courseData, lessons: newLessons});
                                        }}
                                    />
                                    <button className="remove-lesson">−</button>
                                </div>
                            ))}
                            <button className="add-lesson" onClick={handleAddLesson}>
                                <span>+</span>
                                <span>Thêm bài học</span>
                            </button>
                        </div>

                        <div className="form-actions">
                            <button className="back-btn" onClick={() => navigate(-1)}>
                                Trở về
                            </button>
                            <button className="add-course-btn" onClick={handleSubmit}>
                                Thêm khóa học
                            </button>
                            <button className="save-btn">
                                Lưu nháp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCourse;

