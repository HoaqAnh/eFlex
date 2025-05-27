import { useState, useCallback } from 'react';

export const useExerciseInteraction = (initialFontSize = 16, initialAutoNext = false) => {
    const [userAnswers, setUserAnswers] = useState({});
    const [fontSize, setFontSize] = useState(initialFontSize);
    const [autoNextQuestion, setAutoNextQuestion] = useState(initialAutoNext);

    const handleAnswerSelected = useCallback((questionId, answerKey) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answerKey
        }));
    }, []);

    const handleZoomIn = useCallback(() => setFontSize(prevSize => Math.min(prevSize + 2, 28)), []);
    const handleZoomOut = useCallback(() => setFontSize(prevSize => Math.max(prevSize - 2, 12)), []);
    const handleToggleAutoNext = useCallback(() => setAutoNextQuestion(prev => !prev), []);

    const resetUserAnswers = useCallback(() => setUserAnswers({}), []);

    return {
        userAnswers,
        setUserAnswers,
        handleAnswerSelected,
        fontSize,
        autoNextQuestion,
        handleZoomIn,
        handleZoomOut,
        handleToggleAutoNext,
        resetUserAnswers,
    };
}

export default useExerciseInteraction;