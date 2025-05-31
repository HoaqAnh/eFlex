import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useValidation } from './useValidation';
import { creTest, creListeningTest as createListeningGroup, creReadingTest as createReadingPassage } from '../../services/testService';
import { uploadExerciseExcel, uploadListeningAudio, uploadListeningExcel, uploadReadingExcel } from '../../services/exerciseService';
import { toast } from 'react-hot-toast';

export const useCreTest = () => {
    const { id: courseId, lessonId } = useParams();
    const validation = useValidation();

    const initialTestData = {
        name: "",
        duration: 0,
        lesson: {
            id: lessonId
        }
    };
    const initialTestErrorState = { name: "", duration: "" };

    const [testData, setTestData] = useState({ ...initialTestData });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [testErrors, setTestErrors] = useState({ ...initialTestErrorState });

    if (!lessonId || !courseId) {
        console.error('Không tìm thấy courseId hoặc lessonId');
        return {
            testData: { ...initialTestData, lesson: { id: null } },
            setTestData: () => { },
            loading: false,
            error: 'Không tìm thấy courseId hoặc lessonId trong URL.',
            testErrors: { ...initialTestErrorState },
            handleTestInputChange: () => { },
            validateTestForm: () => false,
            resetTestForm: () => { },
            handleSubmitTest: async () => ({ success: false, error: "ID khóa học hoặc bài học không hợp lệ", data: null }),
            courseId: null,
            lessonId: null,
        };
    }

    const handleTestInputChange = useCallback((field, value) => {
        setTestData(prev => ({ ...prev, [field]: value }));
        setTestErrors(prev => ({ ...prev, [field]: "" }));
    }, []);

    const validateTestForm = useCallback(() => {
        const result = validation.validateTestForm(testData);
        setTestErrors(result.errors);
        return result.isValid;
    }, [testData, validation]);

    const resetTestForm = useCallback(() => {
        setTestData({ ...initialTestData, lesson: { id: lessonId } });
        setTestErrors({ ...initialTestErrorState });
    }, [lessonId, initialTestData, initialTestErrorState]);

    const handleSubmitTest = async () => {
        if (!validateTestForm()) {
            toast.error("Vui lòng điền đầy đủ thông tin chung của bài kiểm tra.");
            return { success: false, error: "Dữ liệu không hợp lệ", data: null };
        }

        setLoading(true);
        setError(null);
        try {
            const payload = {
                ...testData,
                duration: parseInt(testData.duration, 10),
            };
            const result = await creTest(payload);
            if (!result.success) {
                throw new Error(result.error?.message || result.message || "Không thể tạo bài kiểm tra.");
            }
            return { success: true, data: result.data };
        } catch (err) {
            console.error('Lỗi khi tạo bài kiểm tra (khung):', err);
            const errorMessage = err.message || 'Không thể tạo bài kiểm tra. Vui lòng thử lại sau.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: err, data: null };
        } finally {
            setLoading(false);
        }
    };

    return {
        testData, setTestData, loading, error, testErrors,
        handleTestInputChange, validateTestForm, resetTestForm, handleSubmitTest,
        courseId, lessonId
    };
};

export const useCreMultipleChoiceTest = () => {
    const validation = useValidation();
    const [loadingMC, setLoadingMC] = useState(false);
    const [errorMC, setErrorMC] = useState(null);
    const [excelFileMC, setExcelFileMC] = useState(null);
    const [mcErrors, setMcErrors] = useState({ excelFile: "" });

    const handleUploadExcelMC = useCallback((file) => {
        setExcelFileMC(file);
        if (file) {
            setMcErrors(prev => ({ ...prev, excelFile: "" }));
            toast.success("Đã chọn file Excel cho trắc nghiệm.");
        }
    }, []);

    const validateMCForm = useCallback(() => {
        const result = validation.validateMCForm(excelFileMC);
        setMcErrors(result.errors);
        return result.isValid;
    }, [excelFileMC, validation]);

    const resetMCForm = useCallback(() => {
        setExcelFileMC(null);
        setMcErrors({ excelFile: "" });
    }, []);

    const handleSubmitMC = async (testId) => {
        if (!validateMCForm()) {
            return { success: false, error: "Dữ liệu trắc nghiệm không hợp lệ" };
        }
        setLoadingMC(true);
        setErrorMC(null);
        try {
            await uploadExerciseExcel(testId, excelFileMC);
            return { success: true };
        } catch (err) {
            console.error('Lỗi khi tải lên file Excel trắc nghiệm:', err);
            const errorMessage = err.message || 'Không thể tải lên file Excel trắc nghiệm.';
            setErrorMC(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: err };
        } finally {
            setLoadingMC(false);
        }
    };

    return {
        loadingMC, errorMC, mcErrors, excelFileMC,
        handleUploadExcelMC, validateMCForm, resetMCForm, handleSubmitMC
    };
};

export const useCreListeningTest = () => {
    const validation = useValidation();
    const initialListeningData = { groupName: "" };
    const initialListeningErrorState = { groupName: "", audioFile: "", excelFile: "" };

    const [listeningData, setListeningData] = useState({ ...initialListeningData });
    const [loadingListening, setLoadingListening] = useState(false);
    const [errorListening, setErrorListening] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [excelFileListening, setExcelFileListening] = useState(null);
    const [listeningErrors, setListeningErrors] = useState({ ...initialListeningErrorState });

    const handleListeningInputChange = useCallback((field, value) => {
        setListeningData(prev => ({ ...prev, [field]: value }));
        setListeningErrors(prev => ({ ...prev, [field]: "" }));
    }, []);

    const handleUploadAudioFile = useCallback((file) => {
        setAudioFile(file);
        if (file) {
            setListeningErrors(prev => ({ ...prev, audioFile: "" }));
            toast.success("Đã chọn file Audio.");
        }
    }, []);

    const handleUploadListeningExcelFile = useCallback((file) => {
        setExcelFileListening(file);
        if (file) {
            setListeningErrors(prev => ({ ...prev, excelFile: "" }));
            toast.success("Đã chọn file Excel cho bài nghe.");
        }
    }, []);

    const validateListeningForm = useCallback(() => {
        const result = validation.validateListeningForm(listeningData, audioFile, excelFileListening);
        setListeningErrors(result.errors);
        return result.isValid;
    }, [listeningData, audioFile, excelFileListening, validation]);

    const resetListeningForm = useCallback(() => {
        setListeningData({ ...initialListeningData });
        setAudioFile(null);
        setExcelFileListening(null);
        setListeningErrors({ ...initialListeningErrorState });
    }, [initialListeningData, initialListeningErrorState]);

    const handleSubmitListening = async (testExerciseId) => {
        if (!validateListeningForm()) {
            return { success: false, error: "Dữ liệu Listening không hợp lệ" };
        }
        setLoadingListening(true);
        setErrorListening(null);
        try {
            const audioUrl = await uploadListeningAudio(audioFile);
            if (!audioUrl) {
                throw new Error("Không thể tải file audio lên server.");
            }

            const listeningGroupPayload = {
                groupName: listeningData.groupName,
                audioFile: audioUrl
            };
            const listeningGroupResult = await createListeningGroup(listeningGroupPayload);
            if (!listeningGroupResult.success || !listeningGroupResult.data || !listeningGroupResult.data.id) {
                throw new Error(listeningGroupResult.error?.message || "Không thể tạo nhóm câu hỏi nghe.");
            }
            const listeningGroupId = listeningGroupResult.data.id;

            const excelUploadParams = { id_TestExercise: testExerciseId, id_Listening: listeningGroupId };
            await uploadListeningExcel(excelUploadParams, excelFileListening);

            return { success: true };
        } catch (err) {
            console.error('Lỗi khi tạo phần Listening:', err);
            const errorMessage = err.message || 'Không thể tạo phần Listening.';
            setErrorListening(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: err };
        } finally {
            setLoadingListening(false);
        }
    };

    return {
        listeningData, loadingListening, errorListening, listeningErrors,
        audioFile, excelFileListening,
        handleListeningInputChange, handleUploadAudioFile, handleUploadListeningExcelFile,
        validateListeningForm, resetListeningForm, handleSubmitListening
    };
};

export const useCreReadingTest = () => {
    const validation = useValidation();
    const initialReadingData = { title: "", readingPassage: "" };
    const initialReadingErrorState = { title: "", readingPassage: "", excelFile: "" };

    const [readingData, setReadingData] = useState({ ...initialReadingData });
    const [loadingReading, setLoadingReading] = useState(false);
    const [errorReading, setErrorReading] = useState(null);
    const [excelFileReading, setExcelFileReading] = useState(null);
    const [readingErrors, setReadingErrors] = useState({ ...initialReadingErrorState });

    const handleReadingInputChange = useCallback((field, value) => {
        setReadingData(prev => ({ ...prev, [field]: value }));
        setReadingErrors(prev => ({ ...prev, [field]: "" }));
    }, []);

    const handleUploadReadingExcelFile = useCallback((file) => {
        setExcelFileReading(file);
        if (file) {
            setReadingErrors(prev => ({ ...prev, excelFile: "" }));
            toast.success("Đã chọn file Excel cho bài đọc hiểu.");
        }
    }, []);

    const validateReadingForm = useCallback(() => {
        const result = validation.validateReadingForm(readingData, excelFileReading);
        setReadingErrors(result.errors);
        return result.isValid;
    }, [readingData, excelFileReading, validation]);

    const resetReadingForm = useCallback(() => {
        setReadingData({ ...initialReadingData });
        setExcelFileReading(null);
        setReadingErrors({ ...initialReadingErrorState });
    }, [initialReadingData, initialReadingErrorState]);

    const handleSubmitReading = async (testExerciseId) => {
        if (!validateReadingForm()) {
            return { success: false, error: "Dữ liệu Reading không hợp lệ" };
        }
        setLoadingReading(true);
        setErrorReading(null);
        try {
            const readingPassagePayload = {
                title: readingData.title,
                content: readingData.readingPassage
            };
            const readingPassageResult = await createReadingPassage(readingPassagePayload);
            if (!readingPassageResult.success || !readingPassageResult.data || !readingPassageResult.data.id) {
                throw new Error(readingPassageResult.error?.message || "Không thể tạo đoạn văn đọc hiểu.");
            }
            const readingPassageId = readingPassageResult.data.id;

            const excelUploadParams = { id_TestExercise: testExerciseId, id_readingPassage: readingPassageId };
            await uploadReadingExcel(excelUploadParams, excelFileReading);

            return { success: true };
        } catch (err) {
            console.error('Lỗi khi tạo phần Reading:', err);
            const errorMessage = err.message || 'Không thể tạo phần Reading.';
            setErrorReading(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: err };
        } finally {
            setLoadingReading(false);
        }
    };

    return {
        readingData, loadingReading, errorReading, readingErrors,
        excelFileReading,
        handleReadingInputChange, handleUploadReadingExcelFile,
        validateReadingForm, resetReadingForm, handleSubmitReading
    };
};