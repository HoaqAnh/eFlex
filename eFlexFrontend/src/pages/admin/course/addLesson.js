import Header from "../../../components/admin/course/addLesson/header";
import Body from "../../../components/admin/course/addLesson/body";
import Footer from "../../../components/admin/course/addLesson/footer";
import Loading from "../../../components/layout/loader/loading"
import Error from "../../../components/layout/loader/error"
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
        removeSelectedVideo
    } = useLessonManagement();

    if (loading) {
        return <div className="addLesson"><Loading Title="Đang tải..." /></div>
    }

    if (error) {
        return <div className="addLesson"><Error Title="Có lỗi xảy ra, vui lòng thử lại sau ít phút." /></div>
    }

    return (
        <div className="addLesson">
            <Header />
            <Body
                lessonData={lessonData}
                lessonErrors={lessonErrors}
                handleLessonInputChange={handleLessonInputChange}
                handleSectionInputChange={handleSectionInputChange}
                sectionData={sectionForms}
                sectionErrors={sectionErrors}
                onTriggerUpload={triggerSectionVideoUpload}
                onRemoveSelectedVideo={removeSelectedVideo}
                onRemoveWholeSection={handleRemoveSection}
            />
            <Footer
                handleBack={handleBack}
                handleAddAndContinue={handleAddAndContinue}
                handleSubmit={handleSubmit}
                handleAddSection={handleAddSection}
                handleAddTest={handleAddTest}
            />
        </div>
    );
};

export default AddLesson;
