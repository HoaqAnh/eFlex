import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useValidation } from './useValidation';

export const useLesson = () => {
    const navigate = useNavigate();
    const { id: courseId } = useParams();
    const validation = useValidation();

    const [lessonData, setLessonData] = useState({
        tenBai: "",
        course: {
            id: courseId
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [lessonErrors, setLessonErrors] = useState({
        tenBai: "",
        course: {
            id: null
        }
    });

    if (!courseId) {
        console.error('Không tìm thấy courseId');
        navigate('/admin/course');
        return {
            lessonData,
            loading,
            error: 'Không tìm thấy courseId',
            lessonErrors,
            handleLessonInputChange: () => { },
            validateLessonForm: () => false
        };
    }

    const handleLessonInputChange = (field, value) => {
        setLessonData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'tenBai') {
            setLessonErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateLessonForm = () => {
        const result = validation.validateLessonForm(lessonData, courseId);
        setLessonErrors(result.errors);
        return result.isValid;
    };

    const resetLessonForm = () => {
        setLessonData({
            tenBai: "",
            course: {
                id: courseId
            }
        });

        setLessonErrors({
            tenBai: "",
            course: {
                id: null
            }
        });
    };

    const handleBack = () => {
        navigate('/admin/course');
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