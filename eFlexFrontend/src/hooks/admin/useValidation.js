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
    const validateTestForm = (testData) => {
        const errors = { name: "", duration: "" };
        let isValid = true;
        if (!testData.name.trim()) {
            errors.name = "Tên bài kiểm tra không được để trống.";
            isValid = false;
        }
        if (!testData.duration || parseInt(testData.duration, 10) <= 0) {
            errors.duration = "Thời gian làm bài phải là số dương.";
            isValid = false;
        } else if (isNaN(parseInt(testData.duration, 10))) {
            errors.duration = "Thời gian làm bài phải là một số.";
            isValid = false;
        }
        return { errors, isValid };
    };

    const validateMCForm = (excelFile) => {
        const errors = { excelFile: "" };
        let isValid = true;
        if (!excelFile) {
            errors.excelFile = "Vui lòng chọn file Excel cho câu hỏi trắc nghiệm.";
            isValid = false;
        }
        return { errors, isValid };
    };

    const validateListeningForm = (listeningData, audioFile, excelFile) => {
        const errors = { groupName: "", audioFile: "", excelFile: "" };
        let isValid = true;
        if (!listeningData.groupName.trim()) {
            errors.groupName = "Tên bài kiểm tra nghe không được để trống.";
            isValid = false;
        }
        if (!audioFile) {
            errors.audioFile = "Vui lòng chọn file Audio.";
            isValid = false;
        }
        if (!excelFile) {
            errors.excelFile = "Vui lòng chọn file Excel cho câu hỏi nghe.";
            isValid = false;
        }
        return { errors, isValid };
    };

    const validateReadingForm = (readingData, excelFile) => {
        const errors = { title: "", readingPassage: "", excelFile: "" };
        let isValid = true;
        if (!readingData.title.trim()) {
            errors.title = "Tiêu đề đoạn văn không được để trống.";
            isValid = false;
        }
        if (!readingData.readingPassage.trim()) {
            errors.readingPassage = "Nội dung đoạn văn không được để trống.";
            isValid = false;
        }
        if (!excelFile) {
            errors.excelFile = "Vui lòng chọn file Excel cho câu hỏi đọc hiểu.";
            isValid = false;
        }
        return { errors, isValid };
    };

    return {
        validateLessonForm,
        validateSectionForm,
        validateMultipleSectionForms,
        validateExcelFile,
        validateCourseForm,
        validateTestForm,
        validateMCForm,
        validateListeningForm,
        validateReadingForm
    };
};