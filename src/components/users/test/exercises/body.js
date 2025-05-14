import React, { useState } from "react";
import MultipleChoice from "./multipleChoice"
import "../../../../styles/exercises/body.css"

const Body = ({ exerciseData }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const questionsArray = exerciseData ? Object.values(exerciseData) : [];
    const question = questionsArray[currentQuestion];

    const handleNextQuestion = () => {
        if (currentQuestion < questionsArray.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    }

    const handlePreQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    }

    if (!questionsArray.length) return <div>No questions available</div>;

    return (
        <div className="exercises__body">
            <div className="exercises__body-content">
                <MultipleChoice
                    currentQuestion={currentQuestion}
                    question={question}
                    totalQuestions={questionsArray.length}
                />
                <div className="exercises__body-content-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePreQuestion}
                        disabled={currentQuestion === 0}
                    >
                        Câu hỏi trước đó
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleNextQuestion}
                        disabled={currentQuestion === questionsArray.length - 1}
                    >
                        Câu hỏi tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Body;