import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:8080/api/v1";

export const useAddCourse = () => {
    const navigate = useNavigate();
    
    // State cho dữ liệu khóa học
    const [courseData, setCourseData] = useState({
        tenMon: "",
        category: "",
        moTa: "",
        anhMonHoc: null // Sẽ lưu URL hoặc ID của ảnh sau khi upload thành công
    });
    
    // State cho trạng thái upload và validation
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        tenMon: "",
        moTa: ""
    });
    
    // State cho tệp hình ảnh và preview
    const [selectedImage, setSelectedImage] = useState(null); // File ảnh được chọn
    const [imagePreview, setImagePreview] = useState(null); // URL preview của ảnh

    // Xử lý thay đổi input
    const handleInputChange = (field, value) => {
        setCourseData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Xóa thông báo lỗi khi người dùng bắt đầu nhập
        if (field === 'tenMon' || field === 'moTa') {
            setFormErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    // Xử lý chọn hình ảnh
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            
            // Tạo preview cho hình ảnh
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Hàm xử lý upload hình ảnh riêng biệt - sẽ được gọi trước khi submit form
    const uploadImage = async () => {
        if (!selectedImage) return null;
        
        // Đây là nơi bạn sẽ thêm code để gọi API upload ảnh trong tương lai
        // Tạm thời trả về null vì chưa có API thực tế
        
        /* 
        Ví dụ mẫu cho API upload ảnh trong tương lai:
        try {
            setUploadingImage(true);
            const token = localStorage.getItem('token');
            
            const imageFormData = new FormData();
            imageFormData.append('image', selectedImage);
            
            const response = await fetch('URL_API_UPLOAD_IMAGE', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: imageFormData
            });
            
            if (!response.ok) throw new Error('Lỗi upload hình ảnh');
            
            const data = await response.json();
            return data.imageUrl; // hoặc data.imageId tùy vào API trả về gì
        } catch (error) {
            console.error('Lỗi khi upload hình ảnh:', error);
            setError('Không thể upload hình ảnh. Vui lòng thử lại.');
            return null;
        } finally {
            setUploadingImage(false);
        }
        */
       
        return null; // Tạm thời trả về null
    };

    // Validate form
    const validateForm = () => {
        let isValid = true;
        const errors = {
            tenMon: "",
            moTa: ""
        };

        // Kiểm tra tenMon
        if (!courseData.tenMon.trim()) {
            errors.tenMon = "Vui lòng nhập tên khóa học";
            isValid = false;
        }

        // Kiểm tra moTa
        if (!courseData.moTa.trim()) {
            errors.moTa = "Vui lòng nhập mô tả khóa học";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Xử lý gửi form
    const handleSubmit = async () => {
        // Validate form trước khi gửi
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Bước 1: Upload hình ảnh nếu có
            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadImage();
            }
            
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
            }
            
            // Bước 2: Tạo payload JSON để gửi thông tin khóa học
            const jsonPayload = {
                tenMon: courseData.tenMon.trim(),
                moTa: courseData.moTa.trim(),
                anhMonHoc: imageUrl // Sẽ là null nếu không có ảnh hoặc upload thất bại
            };
            
            // Thêm các trường không bắt buộc nếu có
            if (courseData.category) {
                jsonPayload.category = courseData.category;
            }
            
            // Gọi API thêm khóa học với JSON
            const response = await fetch(`${BASE_URL}/courses`, {
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
            console.log('Khóa học đã được thêm thành công:', responseData);
            
            // Điều hướng về trang danh sách khóa học
            navigate('/coursePanel');
            
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

    // Xử lý quay lại
    const handleBack = () => {
        navigate('/coursePanel');
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
        handleBack
    };
};