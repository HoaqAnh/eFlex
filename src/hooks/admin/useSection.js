import { useState } from 'react';
import { useValidation } from './useValidation';

export const useSection = () => {
    const validation = useValidation();
    
    // State cho sections (bắt đầu với một section mặc định)
    const [sectionForms, setSectionForms] = useState([{
        id: 1,
        tenBai: "",
        moTa: ""
    }]);
    
    const [sectionErrors, setSectionErrors] = useState([{
        tenBai: "",
        moTa: ""
    }]);

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
                newErrors[formIndex] = {
                    ...newErrors[formIndex],
                    [field]: ""
                };
                return newErrors;
            });
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
        const newFormId = sectionForms.length + 1;
        setSectionForms(prevForms => [
            ...prevForms,
            {
                id: newFormId,
                tenBai: "",
                moTa: ""
            }
        ]);

        setSectionErrors(prevErrors => [
            ...prevErrors,
            {
                tenBai: "",
                moTa: ""
            }
        ]);
    };

    // Hàm xóa một section form
    const handleRemoveSection = (formIndex) => {
        if (sectionForms.length > 1) {
            setSectionForms(prevForms => prevForms.filter((_, index) => index !== formIndex));
            setSectionErrors(prevErrors => prevErrors.filter((_, index) => index !== formIndex));
        }
    };

    // Reset section forms
    const resetSectionForms = () => {
        setSectionForms([{
            id: 1,
            tenBai: "",
            moTa: ""
        }]);
        
        setSectionErrors([{
            tenBai: "",
            moTa: ""
        }]);
    };

    return {
        sectionForms,
        setSectionForms,
        sectionErrors,
        setSectionErrors,
        handleSectionInputChange,
        validateSectionForm,
        validateAllSectionForms,
        handleAddSection,
        handleRemoveSection,
        resetSectionForms
    };
};