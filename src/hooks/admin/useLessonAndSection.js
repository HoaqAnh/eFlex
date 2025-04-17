import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { lessonService } from '../../services/lessonService';

export const useLessonAndSections = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy courseId từ state của location
    const courseId = location.state?.courseId;

    // State cho lesson
    const [lessonData, setLessonData] = useState({
        tenBai: "",
        course: {
            id: courseId
        }
    });

    // State cho sections (bắt đầu với một section mặc định)
    const [sectionForms, setSectionForms] = useState([{
        id: 1,
        tenBai: "",
        moTa: ""
    }]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State cho các lỗi form
    const [lessonErrors, setLessonErrors] = useState({
        tenBai: "",
        course: ""
    });
    
    const [sectionErrors, setSectionErrors] = useState([{
        tenBai: "",
        moTa: ""
    }]);

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

    // Validate lesson form
    const validateLessonForm = () => {
        let isValid = true;
        const errors = {
            tenBai: "",
            course: ""
        };

        // Kiểm tra tenBai
        if (!lessonData.tenBai.trim()) {
            errors.tenBai = "Vui lòng nhập tên bài học";
            isValid = false;
        }

        // Kiểm tra course
        if (!courseId) {
            errors.course = "Không tìm thấy thông tin khóa học";
            isValid = false;
        }

        setLessonErrors(errors);
        return isValid;
    };

    // Validate một section form cụ thể
    const validateSectionForm = (formIndex) => {
        let isValid = true;
        const errors = {
            tenBai: "",
            moTa: ""
        };

        const currentForm = sectionForms[formIndex];

        // Kiểm tra tenBai
        if (!currentForm.tenBai.trim()) {
            errors.tenBai = "Vui lòng nhập tên phần học";
            isValid = false;
        }

        // Kiểm tra moTa
        if (!currentForm.moTa.trim()) {
            errors.moTa = "Vui lòng nhập mô tả phần học";
            isValid = false;
        }

        setSectionErrors(prevErrors => {
            const newErrors = [...prevErrors];
            newErrors[formIndex] = errors;
            return newErrors;
        });

        return isValid;
    };

    // Validate tất cả section forms
    const validateAllSectionForms = () => {
        return sectionForms.every((_, index) => validateSectionForm(index));
    };

    // Validate tất cả forms (lesson và sections)
    const validateAllForms = () => {
        const lessonValid = validateLessonForm();
        const sectionsValid = validateAllSectionForms();
        return lessonValid && sectionsValid;
    };

    // Thêm lesson và các section
    const submitLessonWithSections = async () => {
        // Validate tất cả form trước khi gửi
        if (!validateAllForms()) {
            return { success: false };
        }

        try {
            setLoading(true);
            setError(null);
            
            const result = await lessonService.createLessonWithSections(lessonData, sectionForms);
            
            if (!result.success) {
                throw result.error;
            }
            
            return result;
        } catch (err) {
            console.error('Lỗi khi thêm bài học và các phần học:', err);
            setError(err.message || 'Không thể thêm bài học và các phần học. Vui lòng thử lại sau.');
            
            // Nếu lỗi là do xác thực, chuyển hướng đến trang đăng nhập
            if (err.message.includes("đăng nhập lại")) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    // Xử lý gửi form và quay lại danh sách bài học
    const handleSubmit = async () => {
        const result = await submitLessonWithSections();
        if (result.success) {
            // Điều hướng về trang danh sách bài học của khóa học
            navigate('/coursePanel');
        }
    };

    // Xử lý thêm bài học và tiếp tục thêm bài học mới
    const handleAddAndContinue = async () => {
        const result = await submitLessonWithSections();
        if (result.success) {
            // Reset form để tạo bài học mới
            setLessonData({
                tenBai: "",
                course: {
                    id: courseId
                }
            });
            
            // Reset các phần học
            setSectionForms([{
                id: 1,
                tenBai: "",
                moTa: ""
            }]);
            
            // Reset các lỗi
            setLessonErrors({
                tenBai: "",
                course: ""
            });
            
            setSectionErrors([{
                tenBai: "",
                moTa: ""
            }]);
        }
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

    // Xử lý quay lại
    const handleBack = () => {
        navigate('/coursePanel');
    };

    return {
        // Lesson data
        lessonData,
        handleLessonInputChange,
        lessonErrors,
        
        // Section data
        sectionForms,
        handleSectionInputChange,
        sectionErrors,
        handleAddSection,
        handleRemoveSection,
        
        // Submission
        loading,
        error,
        handleSubmit,
        handleAddAndContinue,
        handleBack
    };
};