import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseApi } from '../../services/courseService';

export const useAddCourse = () => {
    const navigate = useNavigate();
    
    // State cho dữ liệu khóa học
    const [courseData, setCourseData] = useState({
        tenMon: "",
        category: "",
        moTa: "",
        anhMonHoc: null
    });
    
    // State cho trạng thái và validation
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        tenMon: "",
        moTa: "",
        category: "",
        image: ""
    });
    
    // State cho tệp hình ảnh và preview
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Xử lý thay đổi input
    const handleInputChange = (field, value) => {
        setCourseData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Xóa thông báo lỗi khi người dùng bắt đầu nhập
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    // Xử lý chọn hình ảnh
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra định dạng file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setFormErrors(prev => ({
                ...prev,
                image: 'Chỉ chấp nhận file ảnh có định dạng JPG, JPEG hoặc PNG'
            }));
            event.target.value = ''; // Reset input file
            return;
        }

        // Kiểm tra kích thước file (ví dụ: tối đa 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setFormErrors(prev => ({
                ...prev,
                image: 'Kích thước file không được vượt quá 5MB'
            }));
            event.target.value = ''; // Reset input file
            return;
        }

        // Xóa lỗi nếu file hợp lệ
        setFormErrors(prev => ({
            ...prev,
            image: ''
        }));
        
        setSelectedImage(file);
        
        // Tạo preview cho hình ảnh
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Hàm xóa ảnh đã chọn
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setCourseData(prev => ({
            ...prev,
            anhMonHoc: null
        }));
    };

    // Validate form
    const validateForm = () => {
        const errors = {
            tenMon: !courseData.tenMon.trim() ? "Vui lòng nhập tên khóa học" : "",
            moTa: !courseData.moTa.trim() ? "Vui lòng nhập mô tả khóa học" : "",
            category: !courseData.category ? "Vui lòng chọn danh mục" : ""
        };

        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    // Thực hiện gọi API
    const submitCourse = async (apiMethod, redirectPath, extractId = false) => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError(null);
            
            // Upload hình ảnh nếu có
            let imageUrl = null;
            if (selectedImage) {
                setUploadingImage(true);
                try {
                    imageUrl = await CourseApi.uploadCourseImage(selectedImage);
                } catch (err) {
                    setError('Không thể upload hình ảnh. Vui lòng thử lại.');
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }
            
            // Gọi API tạo khóa học
            const responseData = await apiMethod(courseData, imageUrl);
            console.log('Khóa học đã được thêm thành công:', responseData);
            
            // Xử lý điều hướng
            if (extractId) {
                const newCourseId = responseData.data.id;
                navigate(redirectPath, { state: { courseId: newCourseId } });
                console.log("newCourseId: ", newCourseId);
            } else {
                navigate(redirectPath);
            }
            
        } catch (err) {
            console.error('Lỗi khi thêm khóa học:', err);
            setError(err.message || 'Không thể thêm khóa học. Vui lòng thử lại sau.');
            
            // Nếu lỗi là do xác thực, chuyển hướng đến trang đăng nhập
            if (err.message.includes("đăng nhập lại")) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Các handler gọi API với các phương thức khác nhau
    const handleSubmit = () => submitCourse(CourseApi.addCourse, '/coursePanel');
    const handleNext = () => submitCourse(CourseApi.addCourse, '/coursePanel/addCourse/addLesson', true);
    const handleSubmitDraft = () => submitCourse(CourseApi.saveCourseAsDraft, '/coursePanel');
    
    // Xử lý quay lại
    const handleBack = () => navigate('/coursePanel');

    return {
        courseData,
        loading,
        uploadingImage,
        error,
        formErrors,
        imagePreview,
        selectedImage,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleSubmit,
        handleBack,
        handleNext,
        handleSubmitDraft
    };
};