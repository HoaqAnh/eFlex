import React, { useEffect, useState } from "react";
import { useLesson } from "../../../hooks/course/useLesson";
import "../../../styles/users/course/item.css";

const Item = ({ course }) => {
    const { loading, error, fetchCountData } = useLesson();
    const [count, setCount] = useState(null);

    useEffect(() => {
        const getCountData = async () => {
            const data = await fetchCountData(course.id);
            if (data) {
                setCount(data);
            }
        };

        getCountData();
    }, [fetchCountData]);

    if (loading) {
        return <div className="course-body__container">Đang tải khóa học...</div>;
    }

    if (error) {
        return <div className="course-body__container">Lỗi khi tải khóa học: {error}</div>;
    }

    return (
        <div className="course-item">
            <div className="course-item__thumbnail">
                <img
                    src={course?.anhMonHoc || "./courseImage"}
                    alt={course?.tenMon || "course"}
                    className="course-thumbnail"
                />
            </div>
            <div className="course-item__info">
                <h4>{course?.tenMon || "loading..."}</h4>
                <p>{course?.category?.nameCategory || "loading..."}</p>
                <p>{count?.baiHoc || "0"} bài học - {count?.baiTap || "0"} bài tập</p>
            </div>
        </div>
    );
}

export default Item;