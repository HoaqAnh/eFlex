import React from "react";
import { useParams, useNavigate } from "react-router-dom";
//style
import "../../../styles/users/test/list.css"

const List = () => {
    const navigate = useNavigate();
    const { id: courseId, lessonId } = useParams();
    const handleExercises = () => {
        if (courseId && lessonId) {
            navigate(`/courses/${courseId}/lesson/${lessonId}/test/:testId`);
        }
    };
    const exercises = 45;
    const duration = 50;
    return (
        <div className="list-body" onClick={handleExercises}>
            <div className="list-body__container">
                <p>Tên bài kiểm tra</p>
                <div className="divider-vertical"></div>
                <div className="test-info">
                    <p>Số câu hỏi: {exercises}</p>
                    <p>Thời gian làm bài: {duration} phút</p>
                </div>
            </div>
        </div>
    );
}

export default List;