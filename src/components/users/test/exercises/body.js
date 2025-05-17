import { useState, useEffect } from "react";
import MultipleChoice from "./multipleChoice";
import "../../../../styles/exercises/body.css";

const Body = ({ questions, fontSize, autoNextQuestionEnabled, onAnswerSelected, userAnswers }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        setCurrentQuestionIndex(0);
    }, [questions]);

    if (!questions || questions.length === 0) {
        return <div className="exercises__body-content"><p>Không có câu hỏi nào để hiển thị.</p></div>;
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleAnswerSelectionInBody = (selectedAnswerKey) => {
        const questionId = questions[currentQuestionIndex].id;
        onAnswerSelected(questionId, selectedAnswerKey);

        if (autoNextQuestionEnabled) {
            setTimeout(() => {
                handleNextQuestion();
            }, 300);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const currentQuestionUserAnswer = userAnswers[currentQuestion?.id];

    return (
        <div className="exercises__body">
            <div className="exercises__body-content">
                <MultipleChoice
                    currentQuestionDisplayIndex={currentQuestionIndex}
                    question={currentQuestion}
                    fontSize={fontSize}
                    onAnswerSelect={handleAnswerSelectionInBody}
                    selectedAnswerKey={currentQuestionUserAnswer}
                />
                <div className="exercises__body-content-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePreQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        Câu hỏi trước đó
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleNextQuestion}
                        disabled={!questions.length || currentQuestionIndex === questions.length - 1}
                    >
                        Câu hỏi tiếp theo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Body;