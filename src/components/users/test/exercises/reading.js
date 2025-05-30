import { useState } from 'react';
import "../../../../styles/exercises/reading.css";

const Reading = ({ nameGroup, exercises, fontSize = 16, onAnswerSelect, selectedAnswers = {} }) => {
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

    const renderQuestion = (question, questionIndex) => {
        if (!question) return null;

        return (
            <div key={questionIndex} className={questionIndex}>
                <div className="reading__question-form-header">
                    <h4 style={{ fontSize: `${fontSize}px` }}>
                        Câu {questionIndex + 1}: {question.cauHoi}
                    </h4>
                </div>

                <div className="reading__question-form-body-group">
                    {answerKeys.map((key, index) => {
                        const answerText = question[`dapAn${index + 1}`];
                        if (!answerText) return null;

                        const isSelected = selectedAnswers[questionIndex] === key;
                        const buttonClassName = `button-question ${isSelected ? 'selected' : ''}`;

                        return (
                            <button
                                key={key}
                                className={buttonClassName}
                                onClick={() => handleAnswerSelect(questionIndex, key)}
                            >
                                <p style={{ fontSize: `${fontSize}px` }}>{key}. {answerText}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className='reading__question'>
            <div className="reading__question_group">
                <div className="reading__question-form-header">
                    <h3 style={{ fontSize: `${fontSize + 4}px` }}>
                        Đoạn văn đọc hiểu
                    </h3>
                </div>

                <div className="reading__question-form-content">
                    <div className="reading__question-content_text">
                        {nameGroup}
                    </div>
                </div>
            </div>

            <div className="reading__question_group" >
                {/* <div className="reading__question-form"> */}
                    <div className="reading__question-form-header">
                        <div>
                            <h3 style={{ fontSize: `${fontSize + 4}px` }}>
                                Bạn có {exercises.length} câu trong phần đọc hiểu
                            </h3>
                        </div>

                        {/* Tổng quan trả lời */}
                        <div className='reading__question-form-answer_overview'>
                            {exercises.map((_, index) => (
                                <div
                                    key={index}
                                    style={{ fontSize: `${fontSize - 4}px` }}
                                    onClick={() => handleQuestionNavigation(index)}
                                >
                                    {index + 1}: {selectedAnswers[index] || '---'}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hiển thị câu hỏi */}
                    <div className="reading__question-form-body">
                        {renderQuestion(exercises[currentQuestionIndex], currentQuestionIndex)}
                    </div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Reading;