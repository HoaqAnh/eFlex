import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../components/navbar";
import LessonForm from "../../components/admin/course/addLessonForm";
import LessonActions from "../../components/admin/course/addLessonAction";

//hooks
import { useLessonAndSections } from "../../hooks/admin/useLessonAndSection";
import { useAuth } from "../../hooks/useAuth";

//style
import "../../styles/admin/addLesson.css";
import "../../styles/button/style.css";

function AddLesson() {
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
        handleBack
    } = useLessonAndSections();

    const { isAdmin, isAuthenticated, isLoading, error } = useAuth();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="add-lesson">
            <Navbar />
            <div className="add-lesson__main-content">
                {addLessonError && <div className="error-message">{addLessonError}</div>}
                {loading ? (
                    <div className="loading-message">Đang thêm bài học...</div>
                ) : (
                    <>
                        <LessonForm
                            lessonData={lessonData}
                            lessonErrors={lessonErrors}
                            sectionForms={sectionForms}
                            sectionErrors={sectionErrors}
                            handleLessonInputChange={handleLessonInputChange}
                            handleSectionInputChange={handleSectionInputChange}
                            handleAddSection={handleAddSection}
                            handleRemoveSection={handleRemoveSection}
                        />
                        <LessonActions
                            handleSubmit={handleSubmit}
                            handleBack={handleBack}
                            handleAddAndContinue={handleAddAndContinue}
                            handleAddSection={handleAddSection}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default AddLesson;