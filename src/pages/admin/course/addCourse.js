import Header from "../../../components/admin/course/addCourse/header";
import Body from "../../../components/admin/course/addCourse/body";
import Footer from "../../../components/admin/course/addCourse/footer";
import Loading from "../../../components/layout/loader/loading";
import Error from "../../../components/layout/loader/error";
import { useAdminCourse } from "../../../hooks/course/useCourse";
import { useAuth } from "../../../hooks/useAuth";
import { useCategory } from "../../../hooks/useCategory";
import "../../../styles/admin/addCourse/style.css";
import "../../../styles/button/style.css";

const AddCourse = () => {
    const { checkAuth } = useAuth();
    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError
    } = useCategory();
    const {
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

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    if (error) {
        return (
            <Error Title="Có lỗi xảy ra vui lòng thử lại sau ít phút." />
        );
    }

    return (
        <div className="addCourse">
            {error && <div className="error-message">Có lỗi xảy ra vui lòng thử lại sau ít phút.</div>}
            {loading ? (
                <Loading Title="Đang tải lên khóa học..." />
            ) : (
                <>
                    <Header
                        Title="Thêm khóa học"
                    />
                    <Body
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                        categoriesError={categoriesError}
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
                </>
            )}
        </div>
    );
}

export default AddCourse;