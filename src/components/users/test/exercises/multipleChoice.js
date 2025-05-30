import "../../../../styles/exercises/multipleChoice.css";

const MultipleChoice = ({ currentQuestionDisplayIndex, question, fontSize, onAnswerSelect, selectedAnswerKey }) => {
    if (!question) return null;

    const answerKeys = ['A', 'B', 'C', 'D'];

    return (
        <div className="exercises__question">
            <div className="exercises__question-form">
                <div className="exercises__question-form-header">
                    <h4 style={{ fontSize: `${fontSize}px` }}>
                        Câu {currentQuestionDisplayIndex + 1}: {question.cauHoi}
                    </h4>
                </div>
                <div className="exercises__question-form-body">
                    <div className="exercises__question-form-body-group">
                        {answerKeys.map((key, index) => {
                            const answerText = question[`dapAn${index + 1}`];
                            if (!answerText) return null;

                            const buttonClassName = `button-question ${selectedAnswerKey === key ? 'selected' : ''}`;

                            return (
                                <button
                                    key={key}
                                    className={buttonClassName}
                                    onClick={() => onAnswerSelect(key)}
                                >
                                    <p style={{ fontSize: `${fontSize}px` }}>{key}. {answerText}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MultipleChoice;