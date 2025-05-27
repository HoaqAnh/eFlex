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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
                                    </svg>
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