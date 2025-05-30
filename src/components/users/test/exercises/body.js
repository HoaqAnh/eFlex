import { useState, useEffect, useMemo } from "react";
import MultipleChoice from "./multipleChoice";
import Listening from "./listening";
import Reading from './reading';
import "../../../../styles/exercises/body.css";

const getPartType = (key) => {
    if (key.startsWith('LISTENING_')) return 'LISTENING';
    if (key.startsWith('READ_')) return 'READING';
    if (key === 'MultipleChoice') return 'MULTIPLE_CHOICE';
    return 'UNKNOWN';
};

const Body = ({ questions, fontSize, autoNextQuestionEnabled, onAnswerSelected, userAnswers }) => {
    const [orderedPartKeys, setOrderedPartKeys] = useState([]);
    const [currentPartDisplayIndex, setCurrentPartDisplayIndex] = useState(0);
    const [currentMCQuestionIndex, setCurrentMCQuestionIndex] = useState(0);

    useEffect(() => {
        if (questions && typeof questions === 'object' && Object.keys(questions).length > 0) {
            const keys = Object.keys(questions);
            setOrderedPartKeys(keys);
            setCurrentPartDisplayIndex(0);
            setCurrentMCQuestionIndex(0);
        } else {
            setOrderedPartKeys([]);
            setCurrentPartDisplayIndex(0);
            setCurrentMCQuestionIndex(0);
        }
    }, [questions]);

    const currentPartKey = useMemo(() => {
        return orderedPartKeys[currentPartDisplayIndex];
    }, [orderedPartKeys, currentPartDisplayIndex]);

    const currentPartType = useMemo(() => {
        if (!currentPartKey) return 'UNKNOWN';
        return getPartType(currentPartKey);
    }, [currentPartKey]);

    const currentPartData = useMemo(() => {
        if (!questions || !currentPartKey) return null;
        return questions[currentPartKey];
    }, [questions, currentPartKey]);

    const exercisesInCurrentPart = useMemo(() => {
        return currentPartData?.exercises || [];
    }, [currentPartData]);

    const currentMultipleChoiceQuestion = useMemo(() => {
        if (currentPartType === 'MULTIPLE_CHOICE' && exercisesInCurrentPart.length > 0) {
            return exercisesInCurrentPart[currentMCQuestionIndex];
        }
        return null;
    }, [currentPartType, exercisesInCurrentPart, currentMCQuestionIndex]);

    const currentGlobalMCQuestionDisplayIndex = useMemo(() => {
        if (currentPartType !== 'MULTIPLE_CHOICE' || !questions || orderedPartKeys.length === 0) return 0;

        let count = 0;
        for (let i = 0; i < currentPartDisplayIndex; i++) {
            const partKey = orderedPartKeys[i];
            if (questions[partKey] && questions[partKey].exercises) {
                count += questions[partKey].exercises.length;
            }
        }
        return count + currentMCQuestionIndex;
    }, [questions, orderedPartKeys, currentPartDisplayIndex, currentMCQuestionIndex, currentPartType]);


    const handleNextQuestion = () => {
        if (currentPartType === 'MULTIPLE_CHOICE') {
            if (currentMCQuestionIndex < exercisesInCurrentPart.length - 1) {
                setCurrentMCQuestionIndex(prev => prev + 1);
            } else if (currentPartDisplayIndex < orderedPartKeys.length - 1) {
                setCurrentPartDisplayIndex(prev => prev + 1);
                setCurrentMCQuestionIndex(0);
            }
        } else {
            if (currentPartDisplayIndex < orderedPartKeys.length - 1) {
                setCurrentPartDisplayIndex(prev => prev + 1);
                setCurrentMCQuestionIndex(0);
            }
        }
    };

    const handlePreQuestion = () => {
        if (currentPartType === 'MULTIPLE_CHOICE') {
            if (currentMCQuestionIndex > 0) {
                setCurrentMCQuestionIndex(prev => prev - 1);
            } else if (currentPartDisplayIndex > 0) {
                const prevPartIndex = currentPartDisplayIndex - 1;
                const prevPartKey = orderedPartKeys[prevPartIndex];
                const prevPartType = getPartType(prevPartKey);

                setCurrentPartDisplayIndex(prevPartIndex);
                if (prevPartType === 'MULTIPLE_CHOICE') {
                    setCurrentMCQuestionIndex((questions[prevPartKey]?.exercises?.length || 1) - 1);
                } else {
                    setCurrentMCQuestionIndex(0);
                }
            }
        } else {
            if (currentPartDisplayIndex > 0) {
                const prevPartIndex = currentPartDisplayIndex - 1;
                const prevPartKey = orderedPartKeys[prevPartIndex];
                const prevPartType = getPartType(prevPartKey);

                setCurrentPartDisplayIndex(prevPartIndex);
                if (prevPartType === 'MULTIPLE_CHOICE') {
                    setCurrentMCQuestionIndex((questions[prevPartKey]?.exercises?.length || 1) - 1);
                } else {
                    setCurrentMCQuestionIndex(0);
                }
            }
        }
    };

    const selectedAnswersForPart = useMemo(() => {
        if (currentPartType === 'LISTENING' || currentPartType === 'READING') {
            const partAnswers = {};
            if (exercisesInCurrentPart && userAnswers) {
                exercisesInCurrentPart.forEach((q, index) => {
                    if (userAnswers[q.id]) {
                        partAnswers[index] = userAnswers[q.id];
                    }
                });
            }
            return partAnswers;
        }
        return {};
    }, [currentPartType, exercisesInCurrentPart, userAnswers]);

    if (orderedPartKeys.length === 0 || !currentPartData) {
        return <div className="exercises__body-content"><p>Đang tải dữ liệu câu hỏi hoặc không có câu hỏi nào để hiển thị.</p></div>;
    }

    const renderContent = () => {
        switch (currentPartType) {
            case 'LISTENING':
                return (
                    <Listening
                        nameGroup={currentPartData.nameGroup}
                        audioFile={currentPartData.audioFile}
                        exercises={exercisesInCurrentPart}
                        fontSize={fontSize}
                        onAnswerSelect={(localIndex, selectedKey) => {
                            const questionId = exercisesInCurrentPart[localIndex]?.id;
                            if (questionId) {
                                onAnswerSelected(questionId, selectedKey);
                            }
                        }}
                        selectedAnswers={selectedAnswersForPart}
                    />
                );
            case 'READING':
                return (
                    <Reading
                        nameGroup={currentPartData.nameGroup}
                        exercises={exercisesInCurrentPart}
                        fontSize={fontSize}
                        onAnswerSelect={(localIndex, selectedKey) => {
                            const questionId = exercisesInCurrentPart[localIndex]?.id;
                            if (questionId) {
                                onAnswerSelected(questionId, selectedKey);
                            }
                        }}
                        selectedAnswers={selectedAnswersForPart}
                    />
                );
            case 'MULTIPLE_CHOICE':
                if (!currentMultipleChoiceQuestion) {
                    return <p>Không có câu hỏi trắc nghiệm nào trong phần này hoặc phần trắc nghiệm rỗng.</p>;
                }
                return (
                    <MultipleChoice
                        currentQuestionDisplayIndex={currentGlobalMCQuestionDisplayIndex}
                        question={currentMultipleChoiceQuestion}
                        fontSize={fontSize}
                        onAnswerSelect={(selectedKey) => {
                            const questionId = currentMultipleChoiceQuestion.id;
                            onAnswerSelected(questionId, selectedKey);

                            if (autoNextQuestionEnabled) {
                                setTimeout(() => {
                                    handleNextQuestion();
                                }, 300);
                            }
                        }}
                        selectedAnswerKey={userAnswers ? userAnswers[currentMultipleChoiceQuestion.id] : undefined}
                    />
                );
            default:
                return <p>Loại câu hỏi không xác định: {currentPartKey}.</p>;
        }
    };

    const isFirstOverall = currentPartDisplayIndex === 0 && (currentPartType !== 'MULTIPLE_CHOICE' || currentMCQuestionIndex === 0);
    const isLastOverall = currentPartDisplayIndex === orderedPartKeys.length - 1 &&
        (currentPartType !== 'MULTIPLE_CHOICE' || currentMCQuestionIndex === (exercisesInCurrentPart.length > 0 ? exercisesInCurrentPart.length - 1 : 0));


    let prevButtonText = "Phần trước đó";
    if (currentPartType === 'MULTIPLE_CHOICE' && currentMCQuestionIndex > 0) {
        prevButtonText = "Câu hỏi trước đó";
    }

    let nextButtonText = "Phần tiếp theo";
    if (currentPartType === 'MULTIPLE_CHOICE' && exercisesInCurrentPart.length > 0 && currentMCQuestionIndex < exercisesInCurrentPart.length - 1) {
        nextButtonText = "Câu hỏi tiếp theo";
    }


    return (
        <div className="exercises__body">
            <div className="exercises__body-content">
                {renderContent()}
            </div>
            {orderedPartKeys.length > 0 && (
                <div className="exercises__body-content-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePreQuestion}
                        disabled={isFirstOverall}
                    >
                        {prevButtonText}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleNextQuestion}
                        disabled={isLastOverall}
                    >
                        {nextButtonText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Body;