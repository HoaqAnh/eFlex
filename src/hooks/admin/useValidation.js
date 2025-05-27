export const useValidation = () => {
    // Validate lesson form
    const validateLessonForm = (lessonData, courseId) => {
        let isValid = true;
        const errors = {
            tenBai: "",
            course: {
                id: null
            }
        };

        // Kiểm tra tenBai
        if (!lessonData?.tenBai?.trim()) {
            errors.tenBai = "Vui lòng nhập tên bài học";
            isValid = false;
        }

        // Kiểm tra course
        if (!courseId) {
            errors.course = "Không tìm thấy thông tin khóa học";
            isValid = false;
        }

        return { isValid, errors };
    };

    // Validate một section form cụ thể
    const validateSectionForm = (sectionForm) => {
        let isValid = true;
        const errors = {
            tenBai: "",
            moTa: ""
        };

        // Kiểm tra tenBai
        if (!sectionForm.tenBai?.trim()) {
            errors.tenBai = "Vui lòng nhập tên phần học";
            isValid = false;
        }

        // Kiểm tra moTa
        if (!sectionForm.moTa?.trim()) {
            errors.moTa = "Vui lòng nhập mô tả phần học";
            isValid = false;
        }

        return { isValid, errors };
    };

    // Validate nhiều section forms
    const validateMultipleSectionForms = (sectionForms) => {
        const validationResults = sectionForms.map(form => validateSectionForm(form));
        const isAllValid = validationResults.every(result => result.isValid);
        const errors = validationResults.map(result => result.errors);
        
        return { isAllValid, errors };
    };

    // Validate file Excel
    const validateExcelFile = (file) => {
        if (!file) {
            return { 
                isValid: false, 
                error: "Vui lòng chọn file Excel để tải lên" 
            };
        }

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            return { 
                isValid: false, 
                error: "Vui lòng chọn file Excel (.xlsx hoặc .xls)" 
            };
        }

        return { isValid: true };
    };

    // Validate course form
    const validateCourseForm = (courseData) => {
        let isValid = true;
        const errors = {
            tenMon: "",
            moTa: "",
            category: "",
            image: null
        };

        // Kiểm tra tenMon
        if (!courseData.tenMon?.trim()) {
            errors.tenMon = "Vui lòng nhập tên khóa học";
            isValid = false;
        }

        // Kiểm tra moTa
        if (!courseData.moTa?.trim()) {
            errors.moTa = "Vui lòng nhập mô tả khóa học";
            isValid = false;
        }

        // Kiểm tra category
        if (!courseData.category) {
            errors.category = "Vui lòng chọn danh mục";
            isValid = false;
        }

        return { isValid, errors };
    };

    // Validate test form
    const validateTestForm = (testData, excelFile) => {
        let isValid = true;
        const errors = {
            name: "",
            duration: "",
            lesson: "",
            excelFile: ""
        };

        // Kiểm tra tên bài kiểm tra
        if (!testData.name?.trim()) {
            errors.name = "Vui lòng nhập tên bài kiểm tra";
            isValid = false;
        }

        // Kiểm tra thời lượng
        if (!testData.duration || testData.duration <= 0) {
            errors.duration = "Vui lòng nhập thời lượng lớn hơn 0";
            isValid = false;
        }

        // Kiểm tra lesson
        if (!testData.lesson || !testData.lesson.id) {
            errors.lesson = "Không tìm thấy thông tin bài học";
            isValid = false;
        }

        // Kiểm tra file Excel
        if (!excelFile) {
            errors.excelFile = "Vui lòng chọn file Excel để tải lên";
            isValid = false;
        } else if (!excelFile.name.endsWith('.xlsx') && !excelFile.name.endsWith('.xls')) {
            errors.excelFile = "Vui lòng chọn file Excel (.xlsx hoặc .xls)";
            isValid = false;
        }

        return { isValid, errors };
    };

    return {
        validateLessonForm,
        validateSectionForm,
        validateMultipleSectionForms,
        validateExcelFile,
        validateCourseForm,
        validateTestForm
    };
};