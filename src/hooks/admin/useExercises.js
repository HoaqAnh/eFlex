import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { lessonService } from '../../services/lessonService';
import { useValidation } from './useValidation';

export const useExercises = () => {
    const validation = useValidation();
    
    // State cho file Excel
    const [excelFile, setExcelFile] = useState(null);

    // Xử lý tải lên bài tập từ file Excel sử dụng useValidation
    const handleUploadExercise = async (file) => {
        const validationResult = validation.validateExcelFile(file);
        
        if (!validationResult.isValid) {
            toast.error(validationResult.error);
            return { success: false, error: validationResult.error };
        }

        try {
            // Lưu file vào state
            setExcelFile(file);
            
            // Hiển thị thông báo thành công
            toast.success("Đã chọn file Excel thành công!");
            
            return { success: true };
        } catch (error) {
            // Hiển thị thông báo lỗi
            toast.error(error.message || "Có lỗi xảy ra khi chọn file");
            return { success: false, error: error.message };
        }
    };

    // Upload file Excel cho bài học
    const uploadExerciseExcel = async (lessonId) => {
        if (!excelFile) {
            return { success: false, error: "Không có file Excel nào được chọn" };
        }

        try {
            await lessonService.uploadExerciseExcel(lessonId, excelFile);
            return { success: true };
        } catch (error) {
            console.error('Lỗi khi tải lên file bài tập:', error);
            return { success: false, error: error.message || "Không thể tải lên file bài tập" };
        }
    };

    // Reset Excel file
    const resetExcelFile = () => {
        setExcelFile(null);
    };

    return {
        excelFile,
        setExcelFile,
        handleUploadExercise,
        uploadExerciseExcel,
        resetExcelFile
    };
};