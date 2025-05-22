import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useValidation } from './useValidation';

export const useLesson = () => {
    const navigate = useNavigate();
    const { id: courseId } = useParams();
    const validation = useValidation();

    const initialLessonState = {
        tenBai: "",
        course: {
            id: courseId
        }
    };

    const initialLessonErrorState = {
        tenBai: "",
        course: {
            id: null
        }
    };

    const [lessonData, setLessonData] = useState({ ...initialLessonState });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lessonErrors, setLessonErrors] = useState({ ...initialLessonErrorState });

    if (!courseId) {
        console.error('Không tìm thấy courseId');
        navigate('/admin/course');
        return {
            lessonData: { ...initialLessonState, course: { id: null } },
            setLessonData: () => { },
            loading: false,
            setLoading: () => { },
            error: 'Không tìm thấy courseId',
            setError: () => { },
            lessonErrors: { ...initialLessonErrorState },
            setLessonErrors: () => { },
            courseId: null,
            handleLessonInputChange: () => { },
            validateLessonForm: () => false,
            resetLessonForm: () => { },
            handleBack: () => navigate('/admin/course')
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
        setLessonData({ ...initialLessonState, course: { id: courseId } });
        setLessonErrors({ ...initialLessonErrorState });
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