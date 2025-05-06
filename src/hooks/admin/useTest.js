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

    const [testData, setTestData] = useState({
        name: "",
        duration: 0,
        lesson: {
            id: lessonId
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [excelFile, setExcelFile] = useState(null);

    const [testErrors, setTestErrors] = useState({
        name: "",
        duration: "",
        lesson: "",
        excelFile: ""
    });

    const handleTestInputChange = (field, value) => {
        setTestData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'name') {
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
        setTestData({
            name: "",
            duration: 0,
            lesson: {
                id: lessonId
            }
        });

        setTestErrors({
            name: "",
            duration: "",
            lesson: "",
            excelFile: ""
        });
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
            return { success: false };
        }

        try {
            setLoading(true);
            setError(null);

            // Tạo bài kiểm tra
            const result = await createTest(testData);

            if (!result.success) {
                throw result.error;
            }

            // Nếu có file Excel, thực hiện upload
            if (excelFile) {
                await uploadExerciseExcel(result.data.id, excelFile);
                toast.success("Tạo bài kiểm tra và tải lên file Excel thành công!");
            } else {
                toast.success("Tạo bài kiểm tra thành công!");
            }

            return { success: true, data: result.data };

        } catch (err) {
            console.error('Lỗi khi tạo bài kiểm tra:', err);
            setError(err.message || 'Không thể tạo bài kiểm tra. Vui lòng thử lại sau.');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/coursePanel/addCourse/${courseId}/addLesson`);
    };

    const handleSubmitAndCreateLesson = async () => {
        const result = await handleSubmit();
        if (result.success) {
            navigate(`/coursePanel/addCourse/${courseId}/addLesson`);
        }
    };

    const handleSubmitAndCreateTest = async () => {
        const result = await handleSubmit();
        if (result.success) {
            resetTestForm();
            toast.success("Đã tạo bài kiểm tra thành công! Bạn có thể tạo bài kiểm tra mới.");
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