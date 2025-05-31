import "../../../../styles/exercises/reading.css";

const Reading = ({
    passageTitle,
    passageContent,
    question,
    fontSize,
    onAnswerSelect,
    selectedAnswerKey,
    currentQuestionDisplayIndex
}) => {
    if (!question) {
        return (
            <div className='exercises__question'>
                <main className='reading__question-main'>
                    <div className="reading__question-form-content">
                        <h3 style={{ fontSize: `${fontSize}px` }}>{passageTitle || "Đoạn văn đọc hiểu"}</h3>
                        {passageContent && <span style={{ fontSize: `${fontSize - 2}px`, whiteSpace: 'pre-wrap' }}>{passageContent}</span>}
                        <p style={{ marginTop: '1rem' }}>Phần này không có câu hỏi cụ thể hoặc câu hỏi chưa được tải.</p>
                    </div>
                </main>
            </div>
        );
    }


    const answerKeys = ['A', 'B', 'C', 'D'];

    return (
        <div className='exercises__question'>
            <main className='reading__question-main'>
                {(passageTitle || passageContent) && (
                    <div className="reading__question-form-content">
                        {passageTitle && <h3 style={{ fontSize: `${fontSize}px` }}>{passageTitle}</h3>}
                        {passageContent && <div className="reading-passage" style={{ fontSize: `${fontSize - 2}px`, whiteSpace: 'pre-wrap' }}>{passageContent}</div>}
                    </div>
                )}

                <div className="exercises__question-form-body">
                    <div className="exercises__question-form-body_content">
                        <h4 style={{ fontSize: `${fontSize + 2}px` }}>
                            Câu {currentQuestionDisplayIndex + 1}: {question.cauHoi}
                        </h4>
                    </div>

                    <div className="exercises__question-form-body-group">
                        {answerKeys.map((keyLetter, answerIndex) => {
                            const answerText = question[`dapAn${answerIndex + 1}`];
                            if (!answerText) return null;

                            const buttonClassName = `button-question ${selectedAnswerKey === keyLetter ? 'selected' : ''}`;

                            return (
                                <button
                                    key={keyLetter}
                                    className={buttonClassName}
                                    onClick={() => onAnswerSelect(keyLetter)}
                                >
                                    <p style={{ fontSize: `${fontSize}px` }}>{keyLetter}. {answerText}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reading;