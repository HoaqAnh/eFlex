import { useEffect, useState } from "react";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/editCourse/footer";
import Header from "../../../components/admin/course/addCourse/header";
import Loading from "../../../components/layout/loader/loading";
import Error from "../../../components/layout/loader/error";
import { useCourseDetail, useAdminCourse } from "../../../hooks/course/useCourse";
import { useParams } from "react-router-dom";
import { useCategory } from "../../../hooks/course/useCategory";
import { toast } from 'react-hot-toast';
import "../../../styles/admin/editCourse/style.css";

const EditCourse = () => {
    const { id } = useParams();
    const { categoryData, loading: categoriesLoading, error: categoriesError } = useCategory();

    const {
        courseData,
        setInitialCourseDataForEdit,
        loading: editCourseLoading,
        error: editCourseError,
        formErrors,
        imagePreview,
        selectedImage,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleNavigate,
        handleUpdate,
        handleUpdateAndNext,
    } = useAdminCourse();

    const { courseDetail, loading: courseLoading, error: courseError } = useCourseDetail(id);

    const [initialDataIsSet, setInitialDataIsSet] = useState(false);

    useEffect(() => {
        if (courseDetail) {
            setInitialCourseDataForEdit(courseDetail);
            setInitialDataIsSet(true);
        }
    }, [courseDetail, setInitialCourseDataForEdit, initialDataIsSet]);

    useEffect(() => {
        if (!courseLoading && !courseError && !courseDetail && initialDataIsSet) {
            toast.error("Không tìm thấy thông tin khóa học.");
            handleNavigate("course");
        }
    }, [courseDetail, courseLoading, courseError, handleNavigate, initialDataIsSet]);


    const overallLoading = categoriesLoading || editCourseLoading || courseLoading;
    const overallError = categoriesError || editCourseError || courseError;

    if (overallError) {
        return <div className="editCourse"><Error Title="Có lỗi xảy ra, vui lòng thử lại sao ít phút." /></div>
    }

    if (overallLoading) {
        return <div className="editCourse"><Loading Title="Đang tải dữ liệu..." /></div>
    }

    return (
        <div className="editCourse">

            <Header Title="Chỉnh sửa khóa học" />
            <Body
                formData={courseData}
                categories={categoryData}
                imagePreview={imagePreview}
                selectedImage={selectedImage}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleImageSelect={handleImageSelect}
                handleRemoveImage={handleRemoveImage}
            />
            <Footer
                handleBack={() => handleNavigate("course")}
                handleUpdate={() => handleUpdate(id)}
                handleUpdateAndNext={() => handleUpdateAndNext(id)}
            />
        </div>
    );
}

export default EditCourse;