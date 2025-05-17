import "../../../../styles/exercises/header.css";

const Header = ({ testName, totalQuestions, duration, timeLeft, answeredQuestionsCount, onSubmitTest, onCancelTest }) => {
    return (
        <div className="exercises__header">
            <div className="exercises__header-content">
                <div className="exercises__header-right">
                    <div className="exercises__header-right-subcontent">
                        <h2>{testName || "Tên bài học"}</h2>
                    </div>
                    <div className="exercises__header-right-subcontent">
                        <p>Số câu hỏi:</p>
                        <p>{totalQuestions || 0}</p>
                    </div>
                    <div className="exercises__header-right-subcontent">
                        <p>Thời gian:</p>
                        <p>{duration || 0} phút</p>
                    </div>
                    <div className="exercises__header-right-subcontent">
                        <p>Số câu còn lại:</p>
                        <p>{totalQuestions - answeredQuestionsCount}</p>
                    </div>
                </div>
                <div className="exercises__header-left">
                    <div className="exercises__header-left-content">
                        <h4>Thời gian còn lại</h4>
                        <p className="exercises__timeleft">{timeLeft}</p>
                    </div>
                    <div className="exercises__header-left-actions">
                        <button className="btn btn-section-primary" onClick={onSubmitTest}>Nộp bài</button>
                        <button className="btn btn-section-danger" onClick={onCancelTest}>Hủy bài làm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;