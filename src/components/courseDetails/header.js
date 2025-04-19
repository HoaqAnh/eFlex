import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//services
import {  getCourseLessonCount } from "../../services/lessonService";
import { getCourseDetails } from "../../services/courseService";

//styles
import "../../styles/courseDetails/header.css"

function Header() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessonCount, setLessonCount] = useState({ baiHoc: 0, baiTap: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseData, countData] = await Promise.all([
                    getCourseDetails(id),
                    getCourseLessonCount(id)
                ]);
                setCourse(courseData);
                setLessonCount(countData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="header-content">Đang tải...</div>;
    }

    if (error) {
        return <div className="header-content">Có lỗi xảy ra: {error}</div>;
    }

    return (
        <div className="header-content">
            <div className="course-details__header-right">
                <h1 className="header-content__title">{course?.tenMon || 'Khóa học'}</h1>
                <p>{course?.moTa}</p>
                <div className="course-details__header-bottom">
                    <p>{lessonCount.baiHoc} bài học - {lessonCount.baiTap} câu hỏi</p>
                    <div className="course-details__header-right-button">
                        <button className="btn btn-primary">Đánh giá năng lực</button>
                        <button className="btn btn-favorite">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.687t2.45-2.675t1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.687T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025t2.45 2.675T12 18.3m0-6.825" />
                            </svg>
                            Yêu thích
                        </button>
                    </div>
                </div>
            </div>
            <div className="course-details__header-left">
                <img src={course?.anhMonHoc} alt={course?.tenMon} />
            </div>
        </div>
    );
}

export default Header;