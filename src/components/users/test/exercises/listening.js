import "../../../../styles/exercises/listening.css";

const Listening = ({
    nameGroup,
    audioFile,
    question,
    fontSize,
    onAnswerSelect,
    selectedAnswerKey,
    currentQuestionDisplayIndex
}) => {
    if (!question) {
        return (
            <div className="exercises__question">
                <main className='listening__question-main'>
                    <div className="listening__question-form-header">
                        <h3>{nameGroup}</h3>
                        {audioFile && (
                            <div className='audio-media'>
                                <audio controls preload="metadata" src={audioFile}>
                                    <source src={audioFile} type="audio/mpeg" />
                                    <source src={audioFile} type="audio/wav" />
                                    <source src={audioFile} type="audio/ogg" />
                                    Trình duyệt của bạn không hỗ trợ phát audio.
                                </audio>
                            </div>
                        )}
                        <p>Phần này không có câu hỏi cụ thể hoặc câu hỏi chưa được tải.</p>
                    </div>
                </main>
            </div>
        );
    }

    const answerKeys = ['A', 'B', 'C', 'D'];

    return (
        <div className="exercises__question">
            <main className='listening__question-main'>
                <div className="listening__question-form-header">
                    <h3 style={{ fontSize: `${fontSize}px` }}> Bài nghe chủ đề {nameGroup}</h3>
                    {audioFile && (
                        <div className='audio-media'>
                            <audio controls preload="metadata" src={audioFile}>
                                <source src={audioFile} type="audio/mpeg" />
                                <source src={audioFile} type="audio/wav" />
                                <source src={audioFile} type="audio/ogg" />
                                Trình duyệt của bạn không hỗ trợ phát audio.
                            </audio>
                        </div>
                    )}
                </div>

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

export default Listening;