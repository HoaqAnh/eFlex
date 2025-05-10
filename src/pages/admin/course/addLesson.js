import React from "react";

//components
import Header from "../../../components/admin/course/addLesson/header";
import Body from "../../../components/admin/course/addLesson/body";
import Footer from "../../../components/admin/course/addLesson/footer";

//hooks
import { useLessonManagement } from "../../../hooks/admin/useLessonManagement";
import { useAuth } from "../../../hooks/useAuth";

//styles
import "../../../styles/admin/addLesson/style.css";

const AddLesson = () => {
    const { checkAuth } = useAuth();
    const {
        lessonData,
        loading,
        error: addLessonError,
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
        handleAddTest
    } = useLessonManagement();

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    return (
        <div className="addLesson">
            {addLessonError && <div className="error-message">{addLessonError}</div>}
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
