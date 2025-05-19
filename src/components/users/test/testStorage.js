// Helper function để lấy testId từ localStorage
export const getStoredEndTime = (testId) => {
    const storedEndTimeString = localStorage.getItem(`testEndTime_${testId}`);
    return storedEndTimeString ? parseInt(storedEndTimeString, 10) : null;
};

// Helper function để lưu testId vào localStorage
export const storeEndTime = (testId, endTime) => {
    localStorage.setItem(`testEndTime_${testId}`, endTime.toString());
};

// Helper function để xóa testId khỏi localStorage
export const clearStoredEndTime = (testId) => {
    localStorage.removeItem(`testEndTime_${testId}`);
};

// Helper functions để lấy flag 'testAbandoned'
export const getTestAbandonedFlag = (testId) => {
    if (!testId) return false;
    return localStorage.getItem(`testAbandoned_${testId}`) === 'true';
};

// Helper function để lưu flag 'testAbandoned'
export const setTestAbandonedFlag = (testId) => {
    if (!testId) return;
    localStorage.setItem(`testAbandoned_${testId}`, 'true');
};

// Helper function để xóa flag 'testAbandoned'
export const clearTestAbandonedFlag = (testId) => {
    if (!testId) return;
    localStorage.removeItem(`testAbandoned_${testId}`);
};