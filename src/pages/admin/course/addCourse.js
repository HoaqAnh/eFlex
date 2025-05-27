import Header from "../../../components/admin/course/addCourse/header";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/addCourse/footer";
import Loading from "../../../components/layout/loader/loading";
import Error from "../../../components/layout/loader/error";
import { useAdminCourse } from "../../../hooks/course/useCourse";
import { useCategory } from "../../../hooks/course/useCategory";
import "../../../styles/admin/addCourse/style.css";
import "../../../styles/button/style.css";

const AddCourse = () => {
    const { categoryData, loading: categoriesLoading, error: categoriesError } = useCategory();
    const {
        courseData,
        loading: addCourseLoading,
        error: addCourseError,
        formErrors,
        imagePreview, selectedImage,
        handleNavigate,
        handleInputChange,
        handleImageSelect,
        handleRemoveImage,
        handleSubmitDraft,
        handleNext
    } = useAdminCourse();

    const loading = categoriesLoading || addCourseLoading;
    const error = categoriesError || addCourseError;

    if (error) {
        return (
            <Error Title="Có lỗi xảy ra vui lòng thử lại sau ít phút." />
        );
    }

    if (loading) {
        return <div className="editCourse"><Loading Title="Đang tải..." /></div>
    }

    return (
        <div className="addCourse">
            <Header
                Title="Thêm khóa học"
            />
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
                handleSubmitDraft={handleSubmitDraft}
                handleNext={handleNext}
            />
        </div>
    );
}

export default AddCourse;