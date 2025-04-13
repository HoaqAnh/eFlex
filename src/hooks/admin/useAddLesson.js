import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BASE_URL = "http://localhost:8080/api/v1";

export const useAddLesson = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy courseId từ state của location
    const courseId = location.state?.courseId;

    const [lessonData, setLessonData] = useState({
        tenBai: "",
        course: {
            id: courseId
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        tenBai: "",
        course: ""
    });

    // Xử lý thay đổi input
    const handleInputChange = (field, value) => {
        setLessonData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Xóa thông báo lỗi khi người dùng bắt đầu nhập
        if (field === 'tenBai') {
            setFormErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    // Validate form
    const validateForm = () => {
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

        setFormErrors(errors);
        return isValid;
    };

    // Hàm xử lý chung việc thêm bài học
    const addLesson = async () => {
        // Validate form trước khi gửi
        if (!validateForm()) {
            return { success: false };
        }

        try {
            setLoading(true);
            setError(null);
            
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
            }

            const jsonPayload = {
                tenBai: lessonData.tenBai.trim(),
                course: {
                    id: parseInt(courseId)
                }
            };

            // Gọi API thêm bài học
            const response = await fetch(`${BASE_URL}/lesson`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonPayload),
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
                }
            }
            
            const responseData = await response.json();
            console.log("Bài học đã được thêm thành công:", responseData);
            return { success: true, data: responseData };
            
        } catch (err) {
            console.error('Lỗi khi thêm bài học:', err);
            setError(err.message || 'Không thể thêm bài học. Vui lòng thử lại sau.');
            
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
        const result = await addLesson();
        if (result.success) {
            // Điều hướng về trang danh sách bài học của khóa học
            navigate('/coursePanel');
        }
    };

    // Xử lý thêm bài học và tiếp tục thêm bài học mới
    const handleAddLesson = async () => {
        const result = await addLesson();
        if (result.success) {
            // Reset form để tạo bài học mới
            setLessonData({
                tenBai: "",
                course: {
                    id: courseId
                }
            });
        }
    };

    // Xử lý quay lại
    const handleBack = () => {
        navigate('/coursePanel');
    };

    return {
        lessonData,
        loading,
        error,
        formErrors,
        handleInputChange,
        handleSubmit,
        handleBack,
        handleAddLesson
    };
};