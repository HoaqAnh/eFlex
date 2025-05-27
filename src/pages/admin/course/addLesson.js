import Header from "../../../components/admin/course/addLesson/header";
import Body from "../../../components/admin/course/addLesson/body";
import Footer from "../../../components/admin/course/addLesson/footer";
import { useLessonManagement } from "../../../hooks/admin/useLessonManagement";
import "../../../styles/admin/addLesson/style.css";

const AddLesson = () => {
    const {
        lessonData,
        loading,
        error,
        lessonErrors,
        sectionForms,
        sectionErrors,
        handleLessonInputChange,
        handleSectionInputChange,
        handleAddSection,
        handleRemoveSection,
        handleSubmit,
        handleAddAndContinue,
        handleBack,
        handleAddTest,
        triggerSectionVideoUpload,
    } = useLessonManagement();

    return (
        <div className="addLesson">
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="addLesson-isLoading">
                    <div className="addLesson-isLoading__title">
                        Đang tải lên khóa học...
                    </div>
                    <div className="addLesson-isLoading__loader"></div>
                </div>
            ) : (
                <>
                    <Header />
                    <Body
                        lessonData={lessonData}
                        lessonErrors={lessonErrors}
                        handleLessonInputChange={handleLessonInputChange}
                        handleSectionInputChange={handleSectionInputChange}
                        sectionData={sectionForms}
                        sectionErrors={sectionErrors}
                        handleUploadVideo={triggerSectionVideoUpload}
                        handleRemoveSection={handleRemoveSection}
                    />
                    <Footer
                        handleBack={handleBack}
                        handleAddAndContinue={handleAddAndContinue}
                        handleSubmit={handleSubmit}
                        handleAddSection={handleAddSection}
                        handleAddTest={handleAddTest}
                    />
                </>
            )}
        </div>
    );
};

export default AddLesson;
