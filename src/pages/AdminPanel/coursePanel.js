import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/AdminPanel/Navbar";
import Sidebar from "../../components/AdminPanel/Sidebar";

import "../../styles//Navbar.css";
import "../../styles/Sidebar.css";
import "../../styles/PanelStyles/coursePanel.css";

function CoursePanel() {
    const navigate = useNavigate();
    const username = "Admin";
    const token = localStorage.getItem("token");
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const courses = [
        { id: 1, title: "Khóa học 1", lessons: 100, exercises: 1000 },
        { id: 2, title: "Khóa học 2", lessons: 100, exercises: 1000 },
        { id: 3, title: "Khóa học 3", lessons: 100, exercises: 1000 },
        { id: 4, title: "Khóa học 4", lessons: 100, exercises: 1000 },
        { id: 5, title: "Khóa học 5", lessons: 100, exercises: 1000 },
        { id: 6, title: "Khóa học 6", lessons: 100, exercises: 1000 },
        { id: 7, title: "Khóa học 7", lessons: 100, exercises: 1000 },
        { id: 8, title: "Khóa học 8", lessons: 100, exercises: 1000 },
        { id: 9, title: "Khóa học 9", lessons: 100, exercises: 1000 },
        { id: 10, title: "Khóa học 10", lessons: 100, exercises: 1000 },
        { id: 11, title: "Khóa học 11", lessons: 100, exercises: 1000 },
        { id: 12, title: "Khóa học 12", lessons: 100, exercises: 1000 },
        { id: 13, title: "Khóa học 13", lessons: 100, exercises: 1000 },
        { id: 14, title: "Khóa học 14", lessons: 100, exercises: 1000 },
        { id: 15, title: "Khóa học 15", lessons: 100, exercises: 1000 },
        { id: 16, title: "Khóa học 16", lessons: 100, exercises: 1000 },
        { id: 17, title: "Khóa học 17", lessons: 100, exercises: 1000 },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        setSelectedCourses(isChecked ? courses.map(course => course.id) : []);
    };

    const handleSelectCourse = (courseId) => {
        setSelectedCourses(prev => {
            const isSelected = prev.includes(courseId);
            const newSelection = isSelected
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId];
            
            setSelectAll(newSelection.length === courses.length);
            return newSelection;
        });
    };

    useEffect(() => {
        if (token == null)
            navigate("/login");
    }, [token, navigate]);

    return (
        <div className="course-container">
            <Navbar username={username} onlogout={handleLogout} />
            <div className="content-wrapper">
                <Sidebar />
                <div className="main-content">
                    <div className="header-content">
                        <div className="header-left">
                            <h2>Khóa học</h2>
                        </div>
                        <div className="header-right">
                            <label className="select-all">
                                <span>Chọn tất cả</span>
                                <input 
                                    type="checkbox" 
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="courses-grid">
                        {courses.map(course => (
                            <div key={course.id} className="course-card">
                                <div className="course-image">
                                    {/* Placeholder for course image */}
                                    <input
                                        type="checkbox"
                                        className="course-checkbox"
                                        checked={selectedCourses.includes(course.id)}
                                        onChange={() => handleSelectCourse(course.id)}
                                    />
                                </div>
                                <div className="course-info">
                                    <h3>{course.title}</h3>
                                    <p>Số lượng bài giảng: {course.lessons}</p>
                                    <p>Số lượng câu hỏi: {course.exercises}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="footer-content">
                        <button className="btn btn-primary">Thêm khóa học</button>
                        <button 
                            className="btn btn-secondary"
                            disabled={selectedCourses.length === 0}
                        >
                            Chỉnh sửa
                        </button>
                        <button 
                            className="btn btn-primary"
                            disabled={selectedCourses.length === 0}
                        >
                            Bật/tắt khóa học
                        </button>
                        <button 
                            className="btn btn-danger"
                            disabled={selectedCourses.length === 0}
                        >
                            Xóa khóa học
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePanel;