import { useState, useEffect, useMemo } from "react";
import Loading from "../../../../components/layout/loader/loading"
import Error from "../../../../components/layout/loader/error"
import MultipleChoice from "./multipleChoice";
import Listening from "./listening";
import Reading from './reading';
import "../../../../styles/exercises/body.css";

const getPartType = (key) => {
    if (!key) return 'UNKNOWN';
    if (key.startsWith('LISTENING_')) return 'LISTENING';
    if (key.startsWith('READ_')) return 'READING';
    if (key === 'MultipleChoice') return 'MULTIPLE_CHOICE';
    return 'UNKNOWN';
};

const Body = ({ questions, fontSize, autoNextQuestionEnabled, onAnswerSelected, userAnswers }) => {
    const [orderedPartKeys, setOrderedPartKeys] = useState([]);
    const [currentPartDisplayIndex, setCurrentPartDisplayIndex] = useState(0);
    const [currentQuestionIndexInPart, setCurrentQuestionIndexInPart] = useState(0);

    useEffect(() => {
        if (questions && typeof questions === 'object' && Object.keys(questions).length > 0) {
            const keys = Object.keys(questions);
            setOrderedPartKeys(keys);
            setCurrentPartDisplayIndex(0);
            setCurrentQuestionIndexInPart(0);
        } else {
            setOrderedPartKeys([]);
            setCurrentPartDisplayIndex(0);
            setCurrentQuestionIndexInPart(0);
        }
    }, [questions]);

    const currentPartKey = useMemo(() => {
        return orderedPartKeys[currentPartDisplayIndex];
    }, [orderedPartKeys, currentPartDisplayIndex]);

    const currentPartType = useMemo(() => {
        return getPartType(currentPartKey);
    }, [currentPartKey]);

    const currentPartData = useMemo(() => {
        if (!questions || !currentPartKey) return null;
        return questions[currentPartKey];
    }, [questions, currentPartKey]);

    // exercisesInCurrentPart: danh sách các câu hỏi trong phần hiện tại
    const exercisesInCurrentPart = useMemo(() => {
        return currentPartData?.exercises || [];
    }, [currentPartData]);

    // currentExercise: đối tượng câu hỏi hiện tại đang được hiển thị
    const currentExercise = useMemo(() => {
        if (exercisesInCurrentPart.length > 0 && currentQuestionIndexInPart < exercisesInCurrentPart.length) {
            return exercisesInCurrentPart[currentQuestionIndexInPart];
        }
        return null;
    }, [exercisesInCurrentPart, currentQuestionIndexInPart]);

    // currentGlobalQuestionDisplayIndex: Tính số thứ tự câu hỏi trên toàn bộ bài thi
    const currentGlobalQuestionDisplayIndex = useMemo(() => {
        if (!questions || orderedPartKeys.length === 0 || !currentExercise) return 0;

        let count = 0;
        for (let i = 0; i < currentPartDisplayIndex; i++) {
            const partKey = orderedPartKeys[i];
            const partExercises = questions[partKey]?.exercises;
            if (partExercises) {
                count += partExercises.length;
            }
        }

        if (exercisesInCurrentPart && exercisesInCurrentPart.length > 0) {
            count += currentQuestionIndexInPart;
        }
        return count;
    }, [questions, orderedPartKeys, currentPartDisplayIndex, currentQuestionIndexInPart, currentExercise, exercisesInCurrentPart]);


    const handleNextQuestion = () => {
        const partHasExercises = exercisesInCurrentPart && exercisesInCurrentPart.length > 0;

        if (partHasExercises && currentQuestionIndexInPart < exercisesInCurrentPart.length - 1) {
            setCurrentQuestionIndexInPart(prev => prev + 1);
        } else {
            if (currentPartDisplayIndex < orderedPartKeys.length - 1) {
                setCurrentPartDisplayIndex(prev => prev + 1);
                setCurrentQuestionIndexInPart(0);
            }
        }
    };

    const handlePreQuestion = () => {
        const partHasExercises = exercisesInCurrentPart && exercisesInCurrentPart.length > 0;

        if (partHasExercises && currentQuestionIndexInPart > 0) {
            setCurrentQuestionIndexInPart(prev => prev - 1);
        } else {
            if (currentPartDisplayIndex > 0) {
                const prevPartIndex = currentPartDisplayIndex - 1;
                setCurrentPartDisplayIndex(prevPartIndex);

                const prevPartKey = orderedPartKeys[prevPartIndex];
                const prevPartExercises = questions[prevPartKey]?.exercises;
                if (prevPartExercises && prevPartExercises.length > 0) {
                    setCurrentQuestionIndexInPart(prevPartExercises.length - 1);
                } else {
                    setCurrentQuestionIndexInPart(0);
                }
            }
        }
    };

    const allFlattenedQuestions = useMemo(() => {
        if (!questions || orderedPartKeys.length === 0) return [];
        const flattened = [];
        let globalIndexCounter = 0;
        orderedPartKeys.forEach((partKey, partIdx) => {
            const partData = questions[partKey];
            if (partData && partData.exercises && partData.exercises.length > 0) {
                partData.exercises.forEach((exercise, questionInPartIdx) => {
                    flattened.push({
                        ...exercise,
                        globalDisplayIndex: globalIndexCounter,
                        partKey: partKey,
                        partDisplayIndex: partIdx,
                        questionIndexInPart: questionInPartIdx,
                    });
                    globalIndexCounter++;
                });
            }
        });
        return flattened;
    }, [questions, orderedPartKeys]);

    const handleGoToQuestion = (partIndex, questionInPartIdx) => {
        setCurrentPartDisplayIndex(partIndex);
        setCurrentQuestionIndexInPart(questionInPartIdx);
    };


    if (orderedPartKeys.length === 0 || !currentPartData) {
        return (
            <div
                className="exercises__body-content"
                style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <Loading Title="Đang tải dữ liệu hoặc không tìm thấy câu hỏi nào, vui lòng làm mới lại trang nếu quá trình này diễn ra lâu." />
            </div>
        );
    }

    // Xác định trạng thái của nút Previous/Next
    const isFirstQuestionOverall = currentPartDisplayIndex === 0 && currentQuestionIndexInPart === 0;
    const isLastQuestionOverall = () => {
        if (orderedPartKeys.length === 0) return true;
        const lastPartIndex = orderedPartKeys.length - 1;
        if (currentPartDisplayIndex < lastPartIndex) return false;

        // Đang ở phần cuối cùng
        const lastPartExercises = questions[orderedPartKeys[lastPartIndex]]?.exercises;
        if (lastPartExercises && lastPartExercises.length > 0) {
            return currentQuestionIndexInPart >= lastPartExercises.length - 1;
        }
        return true;
    };


    let prevButtonText = "Trước đó";
    let nextButtonText = "Tiếp theo";

    const currentPartHasExercises = exercisesInCurrentPart && exercisesInCurrentPart.length > 0;
    if (currentPartHasExercises) {
        if (currentQuestionIndexInPart > 0) {
            prevButtonText = "Câu hỏi trước đó";
        } else if (currentPartDisplayIndex > 0) {
            prevButtonText = "Phần trước đó";
        }

        if (currentQuestionIndexInPart < exercisesInCurrentPart.length - 1) {
            nextButtonText = "Câu hỏi tiếp theo";
        } else if (currentPartDisplayIndex < orderedPartKeys.length - 1) {
            nextButtonText = "Phần tiếp theo";
        }
    } else {
        if (currentPartDisplayIndex > 0) {
            prevButtonText = "Phần trước đó";
        }
        if (currentPartDisplayIndex < orderedPartKeys.length - 1) {
            nextButtonText = "Phần tiếp theo";
        }
    }

    const renderContent = () => {
        if (!currentExercise && (currentPartType === 'MULTIPLE_CHOICE' || currentPartType === 'LISTENING' || currentPartType === 'READING')) {
            if (exercisesInCurrentPart.length === 0 && (currentPartType === 'MULTIPLE_CHOICE' || currentPartType === 'LISTENING' || currentPartType === 'READING')) {
                return <Loading />;
            }
            return (
                <div
                    className="exercises__body-content"
                    style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                    <Loading Title="Đã hiển thị toàn bộ câu hỏi của bài kiểm tra này" />
                </div>
            );
        }

        const commonQuestionProps = {
            question: currentExercise,
            fontSize: fontSize,
            onAnswerSelect: (selectedKey) => {
                if (currentExercise && currentExercise.id) {
                    onAnswerSelected(currentExercise.id, selectedKey);
                    if (autoNextQuestionEnabled) {
                        setTimeout(() => {
                            handleNextQuestion();
                        }, 300);
                    }
                }
            },
            selectedAnswerKey: currentExercise && userAnswers ? userAnswers[currentExercise.id] : undefined,
            currentQuestionDisplayIndex: currentGlobalQuestionDisplayIndex
        };

        switch (currentPartType) {
            case 'LISTENING':
                if (!currentExercise && exercisesInCurrentPart.length > 0) return <p>Đang chọn câu hỏi nghe...</p>;
                if (!currentExercise && exercisesInCurrentPart.length === 0) return <p>Phần nghe này không có câu hỏi nào.</p>;
                return (
                    <Listening
                        {...commonQuestionProps}
                        nameGroup={currentPartData.nameGroup}
                        audioFile={currentPartData.audioFile}
                    />
                );
            case 'READING':
                if (!currentExercise && exercisesInCurrentPart.length > 0) return <p>Đang chọn câu hỏi đọc...</p>;
                if (!currentExercise && exercisesInCurrentPart.length === 0) return <p>Phần đọc này không có câu hỏi nào.</p>;
                return (
                    <Reading
                        {...commonQuestionProps}
                        passageTitle={currentPartData.title}
                        passageContent={currentPartData.nameGroup}
                    />
                );
            case 'MULTIPLE_CHOICE':
                if (!currentExercise && exercisesInCurrentPart.length > 0) return <p>Đang chọn câu hỏi trắc nghiệm...</p>;
                if (!currentExercise && exercisesInCurrentPart.length === 0) return <p>Phần trắc nghiệm này không có câu hỏi nào.</p>;
                return (
                    <MultipleChoice
                        {...commonQuestionProps}
                    />
                );
            default:
                if (currentPartData && currentPartData.nameGroup) {
                    return <div><h4>{currentPartData.nameGroup}</h4><p>Nội dung của phần này không phải là câu hỏi trắc nghiệm, nghe hoặc đọc.</p></div>;
                }
                return <p>Loại phần không xác định hoặc không có nội dung: {currentPartKey}.</p>;
        }
    };

    return (
        <div className="exercises__body">
            <main className="exercises__body-main">
                <div className="exercises__body-content">
                    {renderContent()}
                </div>
                <div className="exercises__body-answer_overview">
                    <div className="exercises__body-answer_overview-body">
                        {allFlattenedQuestions.map((q) => (
                            <button
                                key={q.id}
                                className={`exercises__body-answer_overview-item ${currentExercise && currentExercise.id === q.id ? 'active' : ''
                                    } ${userAnswers && userAnswers[q.id] ? 'answered' : ''}`}
                                onClick={() => handleGoToQuestion(q.partDisplayIndex, q.questionIndexInPart)}
                                title={q.cauHoi}
                            >
                                Câu {q.globalDisplayIndex + 1}: {userAnswers && userAnswers[q.id] ? userAnswers[q.id] : '--'}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {orderedPartKeys.length > 0 && (
                <footer>
                    <button
                        className="btn btn-secondary"
                        onClick={handlePreQuestion}
                        disabled={isFirstQuestionOverall}
                    >
                        {prevButtonText}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleNextQuestion}
                        disabled={isLastQuestionOverall()}
                    >
                        {nextButtonText}
                    </button>
                </footer>
            )}
        </div>
    );
};

export default Body;