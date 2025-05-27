import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { CourseApi, deleteCourse, fetchCourses, getCourseDetails, updateCourse } from '../../services/courseService';
import { useValidation } from '../admin/useValidation';

let courseListeners = [];
let globalCourseData = [];
let globalCourseMeta = {};

const notifyListeners = (newData, newMeta) => {
    globalCourseData = newData;
    globalCourseMeta = newMeta;
    courseListeners.forEach(listener => listener(newData, newMeta));
};

export const useAdminCourse = (currentPaginationParams) => {
    const navigate = useNavigate();
    const initialCourseState = { tenMon: "", moTa: "", category: "", anhMonHoc: null };

    const [courseData, setCourseData] = useState(globalCourseData.length > 0 ? globalCourseData[0] : { ...initialCourseState });

    const [hasMore, setHasMore] = useState(() => {
        if (globalCourseMeta.page !== undefined && globalCourseMeta.pages !== undefined) {
            return globalCourseMeta.page < globalCourseMeta.pages;
        }
        return true;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { validateCourseForm } = useValidation();
    const [formErrors, setFormErrors] = useState({ ...initialCourseState });

    useEffect(() => {
        const listener = (newData, newMeta) => {
            setCourseData(newData);
            if (newMeta && newMeta.page !== undefined && newMeta.pages !== undefined) {
                setHasMore(newMeta.page < newMeta.pages);
            } else {
                setHasMore(false);
            }
        };

        courseListeners.push(listener);
        setCourseData(globalCourseData);

        if (globalCourseMeta.page !== undefined && globalCourseMeta.pages !== undefined) {
            setHasMore(globalCourseMeta.page < globalCourseMeta.pages);
        }

        return () => {
            courseListeners = courseListeners.filter(l => l !== listener);
        };
    }, []);

    const fetchCourse = useCallback(async (paramsForThisFetch) => {
        setLoading(true);
        setError(null);
        const pageToFetch = paramsForThisFetch && paramsForThisFetch.page !== undefined
            ? paramsForThisFetch.page
            : 0;

        try {
            const response = await fetchCourses({ page: pageToFetch, size: 10 });

            if (!response || !response.result || !response.meta || !response.result.content) {
                throw new Error('Không tìm thấy thông tin khóa học hoặc cấu trúc dữ liệu không đúng.');
            }

            const newContent = response.result.content;
            const meta = response.meta;

            let finalContentForGlobal;
            if (pageToFetch === 0) {
                finalContentForGlobal = newContent;
            } else {
                finalContentForGlobal = [...globalCourseData, ...newContent];
            }

            notifyListeners(finalContentForGlobal, meta);

        } catch (err) {
            console.error('Lỗi khi fetchCourse trong useAdminCourse:', err);
            setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            if (pageToFetch === 0) {
                notifyListeners([], { page: 1, pages: 1 });
            } else {
                notifyListeners(globalCourseData, { ...globalCourseMeta, page: globalCourseMeta.pages || 1 });
            }
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        const globalPageFetched = globalCourseMeta.page ? globalCourseMeta.page - 1 : -1;
        const requestedPage = currentPaginationParams ? currentPaginationParams.page : 0;

        if (requestedPage === 0 && globalCourseData.length === 0) {
            fetchCourse({ page: 0 });
        } else if (requestedPage > globalPageFetched) {
            fetchCourse({ page: requestedPage });
        } else if (requestedPage === 0 && globalCourseData.length > 0 && requestedPage !== globalPageFetched) {
            fetchCourse({ page: 0 });
        }
    }, [currentPaginationParams, fetchCourse]);

    const handleInputChange = (field, value) => {
        setCourseData(prev => ({
            ...prev,
            [field]: value
        }));

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const setInitialCourseDataForEdit = useCallback((data) => {
        setCourseData({ ...initialCourseState, ...data });
        setImagePreview(data.anhMonHoc || null);
        setSelectedImage(null);
        setFormErrors({ ...initialCourseState });
    }, []);

    const submitCourse = async (apiMethod, redirectPath, extractId = false) => {
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

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
            fetchCourse({ page: 0 })

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

    const processCourseUpdate = async (courseIdToUpdate, dataForUpdate, shouldRedirectPath, shouldExtractId = false) => {
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let payload = { ...dataForUpdate };

            if (selectedImage) {
                setUploadingImage(true);
                try {
                    const newImageUrl = await CourseApi.uploadCourseImage(selectedImage);
                    payload.anhMonHoc = newImageUrl;
                } catch (err) {
                    toast.error('Không thể upload hình ảnh. Vui lòng thử lại.');
                    setLoading(false);
                    setUploadingImage(false);
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }

            const response = await updateCourse(courseIdToUpdate, payload);
            toast.success("Cập nhật khóa học thành công!");

            setSelectedImage(null);

            fetchCourse({ page: 0 });

            if (shouldExtractId && response && response.data && response.data.id) {
                return response.data.id;
            } else if (shouldRedirectPath) {
                handleNavigate(shouldRedirectPath);
            }
            return response;

        } catch (err) {
            console.error('Lỗi khi cập nhật khóa học:', err);
            toast.error(err.message || 'Không thể cập nhật khóa học. Vui lòng thử lại sau.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteCourse(courseId);
            if (response.statusCode === 200) {
                toast.success("Xóa khóa học thành công!");
                fetchCourse({ page: 0 });
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
        if (formErrors.image) {
            setFormErrors(prev => ({ ...prev, image: "" }));
        }
    };

    const validateForm = () => {
        const { isValid, errors } = validateCourseForm(courseData);
        setFormErrors(errors);
        return isValid;
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

    const handleUpdate = async (courseIdToUpdate) => {
        await processCourseUpdate(courseIdToUpdate, courseData, 'course');
    };

    const handleUpdateAndNext = async (courseIdToUpdate) => {
        const response = await processCourseUpdate(courseIdToUpdate, courseData, null, true); // Extract ID, không redirect
        if (response && typeof response === 'number') { // Giả sử trả về courseId
            handleNavigate(`course/addCourse/${response}/addLesson`); // Ví dụ: đi đến trang thêm bài học cho khóa vừa sửa
        }
        // const updatedCourseId = await processCourseUpdate(courseIdToUpdate, courseData, null, true);
        // if (updatedCourseId) {
        //     handleNavigate(`course/addCourse/${updatedCourseId}/addLesson`);
        // }
    };

    return {
        courseData,
        setInitialCourseDataForEdit,
        loading,
        error,
        hasMore,
        fetchCourse,

        uploadingImage,
        selectedImage,
        imagePreview,
        formErrors,
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseDetail, setCourseDetail] = useState([]);
    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
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
                setTimeout(() => {
                    setLoading(false);
                }, [300]);
            }
        }

        fetchCourseDetail();
    }, [courseId]);

    return { loading, error, courseDetail }
};