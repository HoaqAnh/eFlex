import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { CourseApi, deleteCourse, fetchCourses, getCourseDetails } from '../../services/courseService';
import { useValidation } from '../admin/useValidation';

let courseListeners = [];
let globalCourseData = [];

const notifyListeners = (newData) => {
    globalCourseData = newData;
    courseListeners.forEach(listener => listener(newData));
};

export const useAdminCourse = () => {
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(globalCourseData);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { validateCourseForm } = useValidation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        tenMon: "",
        moTa: "",
        category: "",
        image: null
    });

    useEffect(() => {
        const listener = (newData) => {
            setCourseData(newData);
        };

        courseListeners.push(listener);

        return () => {
            courseListeners = courseListeners.filter(l => l !== listener);
        };
    }, []);

    const handleInputChange = (field, value) => {
        setCourseData(prev => ({
            ...prev,
            [field]: value
        }));

        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setFormErrors(prev => ({
                ...prev,
                image: 'Chỉ chấp nhận file ảnh có định dạng JPG, JPEG hoặc PNG'
            }));
            event.target.value = '';
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setFormErrors(prev => ({
                ...prev,
                image: 'Kích thước file không được vượt quá 5MB'
            }));
            event.target.value = '';
            return;
        }

        setFormErrors(prev => ({
            ...prev,
            image: ''
        }));

        setSelectedImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setCourseData(prev => ({
            ...prev,
            anhMonHoc: null
        }));
    };

    const validateForm = () => {
        const { isValid, errors } = validateCourseForm(courseData);
        setFormErrors(errors);
        return isValid;
    };

    const submitCourse = async (apiMethod, redirectPath, extractId = false) => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError(null);

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

            const response = await apiMethod(courseData, imageUrl);
            toast.success("Tạo khóa học thành công!");

            fetchCourse();

            if (extractId) {
                const newCourseId = response.data.id;
                return newCourseId;
            } else if (redirectPath) {
                handleNavigate(redirectPath);
            }

        } catch (err) {
            console.error('Lỗi khi thêm khóa học:', err);
            setError(err.message || 'Không thể thêm khóa học. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => submitCourse(CourseApi.addCourse, 'course');

    const handleNext = async () => {
        const courseId = await submitCourse(CourseApi.addCourse, null, true);
        if (courseId) {
            handleNavigate(`course/addCourse/${courseId}/addLesson`);
        }
    };

    const handleSubmitDraft = () => submitCourse(CourseApi.saveCourseAsDraft, 'course');

    const handleNavigate = useCallback((path, options) => {
        navigate(`/admin/${path}`, options);
    }, [navigate]);

    const handleDelete = async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteCourse(courseId);
            if (response.statusCode === 200) {
                toast.success("Xóa khóa học thành công!");
                // Lấy danh sách mới và cập nhật cho tất cả các listeners
                const updatedCourses = await fetchCourses();
                notifyListeners(updatedCourses);
                return true;
            }

            return false;
        } catch (err) {
            console.error('Error deleting courses:', err);
            setError(err.message || 'Không thể xóa khóa học. Vui lòng thử lại sau.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchCourse = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchCourses();

            if (!response) {
                setError('Không tìm thấy thông tin khóa học.');
                return null;
            }

            notifyListeners(response);
            return response;
        } catch (err) {
            console.error(err);
            setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError])

    useEffect(() => {
        if (globalCourseData.length === 0) {
            fetchCourse();
        }
    }, [fetchCourse]);

    const handleUpdate = () => {
        return console.log("Update clicked!");
    }

    const handleUpdateAndNext = () => {
        return console.log("Update and next clicked!");
    }

    return {
        courseData,
        loading,
        uploadingImage,
        error,
        formErrors,
        imagePreview,
        selectedImage,
        fetchCourse,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleSubmit,
        handleNext,
        handleSubmitDraft,
        handleNavigate,
        handleDelete,
        handleUpdate,
        handleUpdateAndNext
    };
};

export const useCourseDetail = (courseId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseDetail, setCourseDetail] = useState([]);
    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCourseDetails(courseId);

                if (!data) {
                    setError('Không tìm thấy thông tin khóa học.');
                    return;
                }

                setCourseDetail(data);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setLoading(false);
            }
        }

        fetchCourseDetail();
    }, [courseId]);

    return { loading, error, courseDetail}
};