import { useState } from 'react';
import { useValidation } from './useValidation';
import { lessonService } from '../../services/lessonService';
import toast from 'react-hot-toast';

export const useSection = () => {
    const validation = useValidation();

    const initialSectionState = {
        id: 1,
        tenBai: "",
        moTa: "",
        videoFile: null,
        video: null
    };

    const initialSectionErrorState = {
        tenBai: "",
        moTa: ""
    };

    // State for sections (bắt đầu với một section mặc định)
    const [sectionForms, setSectionForms] = useState([{ ...initialSectionState }]);

    const [sectionErrors, setSectionErrors] = useState([{ ...initialSectionErrorState }]);

    // Xử lý thay đổi input cho một section form cụ thể
    const handleSectionInputChange = (formIndex, field, value) => {
        setSectionForms(prevForms => {
            const newForms = [...prevForms];
            newForms[formIndex] = {
                ...newForms[formIndex],
                [field]: value
            };
            return newForms;
        });

        // Xóa thông báo lỗi khi người dùng bắt đầu nhập
        if (field === 'tenBai' || field === 'moTa') {
            setSectionErrors(prevErrors => {
                const newErrors = [...prevErrors];
                if (newErrors[formIndex]) {
                    newErrors[formIndex] = {
                        ...newErrors[formIndex],
                        [field]: ""
                    };
                }
                return newErrors;
            });
        }
    };

    // Xử lý lựa chọn file video cho một section form cụ thể
    const handleSectionVideoFileSelect = (formIndex, file) => {
        setSectionForms(prevForms => {
            const newForms = [...prevForms];
            if (newForms[formIndex]) {
                newForms[formIndex] = {
                    ...newForms[formIndex],
                    videoFile: file,
                    video: null
                };
            }
            return newForms;
        });
        if (file) {
            toast.success(`Đã chọn video cho phần học ${formIndex + 1}: ${file.name}`);
        }
    };

    // Validate một section form cụ thể sử dụng useValidation
    const validateSectionForm = (formIndex) => {
        const currentForm = sectionForms[formIndex];
        const result = validation.validateSectionForm(currentForm);

        setSectionErrors(prevErrors => {
            const newErrors = [...prevErrors];
            newErrors[formIndex] = result.errors;
            return newErrors;
        });

        return result.isValid;
    };

    // Validate tất cả section forms sử dụng useValidation
    const validateAllSectionForms = () => {
        const result = validation.validateMultipleSectionForms(sectionForms);
        setSectionErrors(result.errors);
        return result.isAllValid;
    };

    // Hàm thêm một section form mới
    const handleAddSection = () => {
        // const newFormId = sectionForms.length + 1;
        const newFormId = sectionForms.length > 0 ? sectionForms[sectionForms.length - 1].id + 1 : 1;
        setSectionForms(prevForms => [
            ...prevForms,
            {
                ...initialSectionState,
                id: newFormId,
            }
        ]);

        setSectionErrors(prevErrors => [
            ...prevErrors,
            { ...initialSectionErrorState }
        ]);
    };

    // Hàm xóa một section form
    const handleRemoveSection = (formIndex) => {
        if (sectionForms.length > 1) {
            setSectionForms(prevForms => prevForms.filter((_, index) => index !== formIndex));
            setSectionErrors(prevErrors => prevErrors.filter((_, index) => index !== formIndex));
        } else {
            toast.error("Không thể xóa phần học cuối cùng.");
        }
    };

    // Reset section forms
    const resetSectionForms = () => {
        setSectionForms([{ ...initialSectionState, id: 1 }]);
        setSectionErrors([{ ...initialSectionErrorState }]);
    };

    // Upload video cho một section cụ thể
    const handleUploadVideo = async (formIndex) => {
        const sectionToUpdate = sectionForms[formIndex];

        if (sectionToUpdate && sectionToUpdate.videoFile) {
            try {
                toast.loading(`Đang tải lên video cho phần học ${formIndex + 1}...`, { id: `upload-${formIndex}` });
                const videoUrl = await lessonService.uploadSectionVideo(sectionToUpdate.videoFile);
                setSectionForms(prevForms => {
                    const newForms = [...prevForms];
                    if (newForms[formIndex]) {
                        newForms[formIndex] = {
                            ...newForms[formIndex],
                            video: videoUrl,
                            videoFile: null
                        };
                    }
                    return newForms;
                });
                toast.success(`Video cho phần học ${formIndex + 1} đã tải lên thành công!`, { id: `upload-${formIndex}` });
                return videoUrl;
            } catch (error) {
                console.error(`Lỗi khi tải video cho phần học ${formIndex + 1}:`, error);
                toast.error(`Lỗi tải lên video cho phần học ${formIndex + 1}. Vui lòng thử lại sau.`, { id: `upload-${formIndex}` });
                return null;
            }
        }

        return sectionToUpdate ? sectionToUpdate.video : null;
    };

    return {
        sectionForms,
        sectionErrors,
        handleSectionInputChange,
        validateSectionForm,
        validateAllSectionForms,
        handleAddSection,
        handleRemoveSection,
        resetSectionForms,
        handleUploadVideo,
        handleSectionVideoFileSelect
    };
};