// --- Helpers cho thời gian kết thúc (End Time) ---
export const getStoredEndTime = (testId) => {
    if (!testId) return null;
    const storedEndTimeString = sessionStorage.getItem(`testEndTime_${testId}`);
    return storedEndTimeString ? parseInt(storedEndTimeString, 10) : null;
};

export const storeEndTime = (testId, endTime) => {
    if (!testId) return;
    sessionStorage.setItem(`testEndTime_${testId}`, endTime.toString());
};

export const clearStoredEndTime = (testId) => {
    if (!testId) return;
    sessionStorage.removeItem(`testEndTime_${testId}`);
};

// --- Helpers cho cờ 'testAbandoned' ---
export const getTestAbandonedFlag = (testId) => {
    if (!testId) return false;
    return sessionStorage.getItem(`testAbandoned_${testId}`) === 'true';
};

export const setTestAbandonedFlag = (testId) => {
    if (!testId) return;
    sessionStorage.setItem(`testAbandoned_${testId}`, 'true');
};

export const clearTestAbandonedFlag = (testId) => {
    if (!testId) return;
    sessionStorage.removeItem(`testAbandoned_${testId}`);
};

// --- Helpers cho câu trả lời của người dùng (User Answers) ---
export const getStoredUserAnswers = (testId) => {
    if (!testId) return null;
    const answersString = sessionStorage.getItem(`userAnswers_${testId}`);
    try {
        return answersString ? JSON.parse(answersString) : null;
    } catch (e) {
        console.error("Lỗi phân tích câu trả lời đã lưu từ sessionStorage:", e);
        sessionStorage.removeItem(`userAnswers_${testId}`);
        return null;
    }
};

export const storeUserAnswers = (testId, answers) => {
    if (!testId) return;
    try {
        if (answers && Object.keys(answers).length > 0) {
            sessionStorage.setItem(`userAnswers_${testId}`, JSON.stringify(answers));
        } else {
            sessionStorage.removeItem(`userAnswers_${testId}`);
        }
    } catch (e) {
        console.error("Lỗi lưu câu trả lời vào sessionStorage:", e);
    }
};

export const clearStoredUserAnswers = (testId) => {
    if (!testId) return;
    sessionStorage.removeItem(`userAnswers_${testId}`);
};