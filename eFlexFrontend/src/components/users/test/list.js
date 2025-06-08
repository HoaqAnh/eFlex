import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/users/test/list.css";

const List = ({ testData }) => {
    const { id: courseId, lessonId } = useParams();
    const navigate = useNavigate();
    console.log(testData)
    const testName = testData.name || "Không có tên cho bài kiểm tra";
    const exercisesCount = testData.totalQuestion || 0;
    const duration = testData.duration || 0;
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