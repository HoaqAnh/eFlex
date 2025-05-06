import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { lessonService } from '../../services/lessonService';

import { useLesson } from './useLesson';
import { useSection } from './useSection';

export const useLessonManagement = () => {
    const navigate = useNavigate();

    const lesson = useLesson();
    const section = useSection();

    const validateAllForms = () => {
        const lessonValid = lesson.validateLessonForm();
        const sectionsValid = section.validateAllSectionForms();
        return lessonValid && sectionsValid;
    };

    // Thêm lesson và các section
    const submitLessonWithSections = async () => {
        if (!validateAllForms()) {
            return { success: false };
        }

        try {
            lesson.setLoading(true);
            lesson.setError(null);

            const result = await lessonService.createLessonWithSections(
                lesson.lessonData,
                section.sectionForms
            );

            if (!result.success) {
                throw result.error;
            }

            return result;
        } catch (err) {
            console.error('Lỗi khi thêm bài học và các phần học:', err);
            lesson.setError(err.message || 'Không thể thêm bài học và các phần học. Vui lòng thử lại sau.');
            return { success: false, error: err };
        } finally {
            lesson.setLoading(false);
        }
    };

    // Xử lý thêm bài kiểm tra
    const handleAddTest = async () => {
        const result = await submitLessonWithSections();

        if (result.success) {
            toast.success("Tạo bài học thành công!");
            const lessonId = result.lessonData.data.id;
            const courseId = result.lessonData.data.course.id;
            navigate(`/coursePanel/addCourse/${courseId}/addLesson/${lessonId}/addTest`);
        }
    };

    // Xử lý gửi form và quay lại danh sách bài học
    const handleSubmit = async () => {
        const result = await submitLessonWithSections();

        if (result.success) {
            toast.success("Tạo bài học thành công!");
            navigate('/coursePanel');
        }
    };

    // Xử lý thêm bài học và tiếp tục thêm bài học mới
    const handleAddAndContinue = async () => {
        const result = await submitLessonWithSections();

        if (result.success) {
            toast.success("Tạo bài học thành công!");
            // Reset tất cả các form
            lesson.resetLessonForm();
            section.resetSectionForms();
        }
    };

    return {
        // Lesson data
        lessonData: lesson.lessonData,
        handleLessonInputChange: lesson.handleLessonInputChange,
        lessonErrors: lesson.lessonErrors,

        // Section data
        sectionForms: section.sectionForms,
        handleSectionInputChange: section.handleSectionInputChange,
        sectionErrors: section.sectionErrors,
        handleAddSection: section.handleAddSection,
        handleRemoveSection: section.handleRemoveSection,

        // Submission
        loading: lesson.loading,
        error: lesson.error,
        handleSubmit,
        handleAddAndContinue,
        handleBack: lesson.handleBack,

        // Bài kiểm tra
        handleAddTest
    };
};