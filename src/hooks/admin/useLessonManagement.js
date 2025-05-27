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

    const triggerSectionVideoUpload = (sectionIndex) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('video/')) {
                    toast.error('Định dạng tệp không hợp lệ. Vui lòng chọn một tệp video.');
                    return;
                }
                section.handleSectionVideoFileSelect(sectionIndex, file);
            }
        };
        input.click();
    };

    const removeSelectedVideo = section.removeSelectedVideo;

    // Thêm lesson và các section
    const submitLessonWithSections = async () => {
        if (!validateAllForms()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return { success: false };
        }

        lesson.setLoading(true);
        lesson.setError(null);

        try {
            // Xử lý upload video cho các phần học có file video được chọn.
            const currentSectionForms = [...section.sectionForms];
            const updatedSectionForms = [];

            for (let i = 0; i < currentSectionForms.length; i++) {
                let sectionForm = { ...currentSectionForms[i] };
                if (sectionForm.videoFile) {
                    const videoUrl = await section.handleUploadVideo(i);
                    if (videoUrl) {
                        sectionForm.video = videoUrl;
                        sectionForm.videoFile = null;
                    }
                }
                updatedSectionForms.push(sectionForm);
            }

            const result = await lessonService.createLessonWithSections(
                lesson.lessonData,
                updatedSectionForms
            );

            if (!result.success) {
                throw result.error || new Error('Lỗi không xác định khi tạo bài học.');
            }

            return result;
        } catch (err) {
            console.error('Lỗi khi thêm bài học và các phần học:', err);
            lesson.setError(err.message || 'Không thể thêm bài học và các phần học. Vui lòng thử lại sau.');
            toast.error(err.message || 'Không thể thêm bài học và các phần học. Vui lòng thử lại sau.');
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
            navigate(`${lessonId}/addTest`);
        }
    };

    // Xử lý gửi form và quay lại danh sách bài học
    const handleSubmit = async () => {
        const result = await submitLessonWithSections();

        if (result.success) {
            toast.success("Tạo bài học thành công!");
            navigate('/admin/course');
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
        triggerSectionVideoUpload,
        removeSelectedVideo: section.removeSelectedVideo,

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