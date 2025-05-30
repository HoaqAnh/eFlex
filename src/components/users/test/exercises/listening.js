import { useState } from 'react';
import "../../../../styles/exercises/multipleChoice.css";

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
            <div className="exercises__question-form">
                <div className="exercises__question-form-header">
                    <h3 style={{ fontSize: `${fontSize + 4}px`, marginBottom: '1rem' }}>
                        {nameGroup}
                    </h3>

                    {audioFile && (
                        <div style={{ marginBottom: '1rem' }}>
                            <audio
                                controls
                                style={{ width: '100%', maxWidth: '500px' }}
                                preload="metadata"
                            >
                                <source src={audioFile} type="audio/mpeg" />
                                <source src={audioFile} type="audio/wav" />
                                <source src={audioFile} type="audio/ogg" />
                                Trình duyệt của bạn không hỗ trợ phát audio.
                            </audio>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem'
                    }}>
                        {exercises.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionNavigation(index)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: currentQuestionIndex === index ? '2px solid #0d6efd' : '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    background: currentQuestionIndex === index ? '#cfe2ff' : 'var(--background-secondary)',
                                    cursor: 'pointer',
                                    fontSize: `${fontSize - 2}px`,
                                    color: 'var(--text-primary)'
                                }}
                            >
                                Câu {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="exercises__question-form-body">
                    {exercises[currentQuestionIndex] && (
                        <div>
                            <div className="exercises__question-form-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
                                            </svg>
                                            <p style={{ fontSize: `${fontSize}px` }}>{key}. {answerText}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: `${fontSize}px`, marginBottom: '1rem' }}>
                        Tổng quan các câu trả lời:
                    </h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '0.5rem'
                    }}>
                        {exercises.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    background: selectedAnswers[index] ? '#e8f5e8' : 'var(--background-secondary)',
                                    fontSize: `${fontSize - 2}px`
                                }}
                            >
                                Câu {index + 1}: {selectedAnswers[index] || '---'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Listening;