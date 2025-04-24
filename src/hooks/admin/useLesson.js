import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useValidation } from './useValidation';

export const useLesson = () => {
    const navigate = useNavigate();
    const { id: courseId } = useParams();
    const validation = useValidation();
    
    // State cho lesson
    const [lessonData, setLessonData] = useState({
        tenBai: "",
        course: {
            id: courseId
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State cho các lỗi form
    const [lessonErrors, setLessonErrors] = useState({
        tenBai: "",
        course: ""
    });

    // Kiểm tra nếu không có courseId
    if (!courseId) {
        console.error('Không tìm thấy courseId');
        navigate('/coursePanel');
        return {
            lessonData,
            loading,
            error: 'Không tìm thấy courseId',
            lessonErrors,
            handleLessonInputChange: () => {},
            validateLessonForm: () => false
        };
    }

    // Xử lý thay đổi input cho lesson
    const handleLessonInputChange = (field, value) => {
        setLessonData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Xóa thông báo lỗi khi người dùng bắt đầu nhập
        if (field === 'tenBai') {
            setLessonErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    // Validate lesson form sử dụng useValidation
    const validateLessonForm = () => {
        const result = validation.validateLessonForm(lessonData, courseId);
        setLessonErrors(result.errors);
        return result.isValid;
    };

    // Reset lesson form
    const resetLessonForm = () => {
        setLessonData({
            tenBai: "",
            course: {
                id: courseId
            }
        });
        
        setLessonErrors({
            tenBai: "",
            course: ""
        });
    };

    // Quay lại trang course panel
    const handleBack = () => {
        navigate('/coursePanel');
    };

    return {
        lessonData,
        setLessonData,
        loading,
        setLoading,
        error,
        setError,
        lessonErrors,
        setLessonErrors,
        courseId,
        handleLessonInputChange,
        validateLessonForm,
        resetLessonForm,
        handleBack
    };
};