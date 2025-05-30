import { useState } from 'react';
import "../../../../styles/exercises/listening.css";

const Listening = ({ nameGroup, audioFile, exercises, fontSize = 16, onAnswerSelect, selectedAnswers = {} }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (!exercises || exercises.length === 0) return null;

    const answerKeys = ['A', 'B', 'C', 'D'];

    const handleQuestionNavigation = (index) => {
        setCurrentQuestionIndex(index);
    };

    const handleAnswerSelect = (questionIndex, answerKey) => {
        if (onAnswerSelect) {
            onAnswerSelect(questionIndex, answerKey);
        }
    };

    return (
        <div className="exercises__question">
            <div className='exercises__question-form_main'>

                <div className="exercises__question-form-header">
                    <h3 style={{ fontSize: `${fontSize + 4}px` }}>
                        Bạn có {exercises.length} câu hỏi nghe cần hoàn thành
                    </h3>

                    {audioFile && (
                        <div className='audio-media'>
                            <audio
                                controls
                                preload="metadata"
                            >
                                <source src={audioFile} type="audio/mpeg" />
                                <source src={audioFile} type="audio/wav" />
                                <source src={audioFile} type="audio/ogg" />
                                Trình duyệt của bạn không hỗ trợ phát audio.
                            </audio>
                        </div>
                    )}
                </div>

                {exercises[currentQuestionIndex] && (
                    <div className="exercises__question-form-body">
                        <div className="exercises__question-form-body_content">
                            <h4 style={{ fontSize: `${fontSize}px` }}>
                                Câu {currentQuestionIndex + 1}: {exercises[currentQuestionIndex].cauHoi}
                            </h4>
                        </div>

                        <div className="exercises__question-form-body-group">
                            {answerKeys.map((key, index) => {
                                const answerText = exercises[currentQuestionIndex][`dapAn${index + 1}`];
                                if (!answerText) return null;

                                const isSelected = selectedAnswers[currentQuestionIndex] === key;
                                const buttonClassName = `button-question ${isSelected ? 'selected' : ''}`;

                                return (
                                    <button
                                        key={key}
                                        className={buttonClassName}
                                        onClick={() => handleAnswerSelect(currentQuestionIndex, key)}
                                    >
                                        <p style={{ fontSize: `${fontSize}px` }}>{key}. {answerText}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className='exercises__question-form_side'>
                <div className='exercises__question-form-answer_overview'>
                    <h4 style={{ fontSize: `${fontSize}px` }}>
                        Câu trả lời của bạn
                    </h4>
                    <div className='exercises__question-form-answer_overview-body'>
                        {exercises.map((_, index) => (
                            <button
                                className='exercises__question-form-answer_overview-item'
                                key={index}
                                style={{ fontSize: `${fontSize - 2}px` }}
                                onClick={() => handleQuestionNavigation(index)}
                            >
                                Câu {index + 1}: {selectedAnswers[index] || '---'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Listening;