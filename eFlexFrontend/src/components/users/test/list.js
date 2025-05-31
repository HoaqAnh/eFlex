import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/users/test/list.css";

const List = ({ testData }) => {
    const { id: courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const testName = testData.name;
    const exercisesCount = testData.exerciseList ? testData.exerciseList.length : 0;
    const duration = testData.duration;
    const testId = testData.id;

    const handleNavigateToTest = () => {
        if (courseId && lessonId && testId) {
            navigate(`/course/${courseId}/lesson/${lessonId}/test/${testId}`);
        } else {
            console.error("Missing IDs for navigation: ", { courseId, lessonId, testId });
        }
    };

    return (
        <div className="list-body" onClick={handleNavigateToTest}>
            <div className="list-body__container">
                <p>{testName}</p>
                <div className="divider-vertical"></div>
                <div className="test-info">
                    <p>Số câu hỏi: {exercisesCount}</p>
                    <p>Thời gian làm bài: {duration} phút</p>
                </div>
            </div>
        </div>
    );
};

export default List;