import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useValidation } from './useValidation';
import { createTest } from '../../services/testService';
import { uploadExerciseExcel } from '../../services/exerciseService';
import { toast } from 'react-hot-toast';

export const useTest = () => {
    const navigate = useNavigate();
    const { id: courseId, lessonId } = useParams();
    const validation = useValidation();

    const initialTestData = {
        name: "",
        duration: 0,
        lesson: {
            id: lessonId
        }
    };

    const initialTestErrorState = {
        name: "",
        duration: "",
        lesson: "",
        excelFile: ""
    };

    const [testData, setTestData] = useState({ ...initialTestData });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [testErrors, setTestErrors] = useState({ ...initialTestErrorState });

    if (!lessonId || !courseId) {
        console.error('Không tìm thấy courseId hoặc lessonId');
        navigate('/admin/course');
        return {
            testData: { ...initialTestData, lesson: { id: null } },
            setTestData: () => { },
            loading: false,
            setLoading: () => { },
            error: 'Không tìm thấy courseId hoặc lessonId',
            setError: () => { },
            testErrors: { ...initialTestErrorState },
            setTestErrors: () => { },
            excelFile: null,
            setExcelFile: () => { },
            handleTestInputChange: () => { },
            validateTestForm: () => false,
            resetTestForm: () => { },
            handleUploadExcel: async () => ({ success: false, error: "ID không hợp lệ" }),
            handleSubmit: async () => ({ success: false, error: "ID không hợp lệ" }),
            handleCancel: () => navigate('/admin/course'),
            handleSubmitAndCreateLesson: async () => { },
            handleSubmitAndCreateTest: async () => { }
        };
    }


    const handleTestInputChange = (field, value) => {
        setTestData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'name' || field === 'duration') {
            setTestErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateTestForm = () => {
        const result = validation.validateTestForm(testData, excelFile);
        setTestErrors(result.errors);
        return result.isValid;
    };

    const resetTestForm = () => {
        setTestData({ ...initialTestData, lesson: { id: lessonId } });
        setTestErrors({ ...initialTestErrorState });
        setExcelFile(null);
    };

    const handleUploadExcel = async (file) => {
        try {
            setExcelFile(file);
            setTestErrors(prev => ({
                ...prev,
                excelFile: ""
            }));
            toast.success("Đã chọn file Excel thành công!");
            return { success: true };
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi chọn file");
            return { success: false, error: error.message };
        }
    };

    const handleSubmit = async () => {
        if (!validateTestForm()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc bao gồm cả file Excel.");
            return { success: false };
        }

        setLoading(true);
        setError(null);

        try {
            const testPayload = {
                ...testData,
                duration: parseInt(testData.duration, 10) || 0,
            };
            const result = await createTest(testPayload);

            if (!result.success) {
                throw new Error(result.error?.message || result.message || "Không thể tạo bài kiểm tra.");
            }

            const createdTestId = result.data.id;

            if (excelFile) {
                await uploadExerciseExcel(createdTestId, excelFile);
                toast.success("Tạo bài kiểm tra và tải lên file Excel thành công!");
            } else {
                toast.success("Tạo bài kiểm tra thành công!");
            }

            return { success: true, data: result.data };

        } catch (err) {
            console.error('Lỗi khi tạo bài kiểm tra:', err);
            const errorMessage = err.message || 'Không thể tạo bài kiểm tra. Vui lòng thử lại sau.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/course/addCourse/${courseId}/addLesson`);
    };

    const handleSubmitAndCreateLesson = async () => {
        const result = await handleSubmit();
        if (result.success) {
            navigate(`/admin/course/addCourse/${courseId}/addLesson`);
        }
    };

    const handleSubmitAndCreateTest = async () => {
        const result = await handleSubmit();
        if (result.success) {
            resetTestForm();
        }
    };

    return {
        testData,
        loading,
        error,
        testErrors,
        excelFile,
        handleTestInputChange,
        validateTestForm,
        resetTestForm,
        handleUploadExcel,
        handleSubmit,
        handleCancel,
        handleSubmitAndCreateLesson,
        handleSubmitAndCreateTest
    };
};