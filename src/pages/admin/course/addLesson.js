import React from "react";
import { Navigate } from "react-router-dom";

//components
import Navbar from "../../../components/navbar";
import Header from "../../../components/admin/course/addLesson/header";
import Body from "../../../components/admin/course/addLesson/body";
import Footer from "../../../components/admin/course/addLesson/footer";

//hooks
import { useLessonManagement } from "../../../hooks/admin/useLessonManagement";
import { useAuth } from "../../../hooks/useAuth";

//styles
import "../../../styles/admin/addLesson/style.css";

const AddLesson = () => {
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
        handleUploadTest,

        // Bài kiểm tra
        handleAddTest
    } = useLessonManagement();

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
        <div className="addLesson">
            <Navbar />
            <div className="addLesson__main-content">
                {addLessonError && <div className="error-message">{addLessonError}</div>}
                {loading ? (
                    <div className="loading-message">Đang thêm bài học...</div>
                ) : (
                    <>
                        <Header />
                        <div className="addLesson__content-wrapper">
                            <Body
                                lessonData={lessonData}
                                lessonErrors={lessonErrors}
                                handleLessonInputChange={handleLessonInputChange}
                                handleSectionInputChange={handleSectionInputChange}
                                sectionData={sectionForms}
                                sectionErrors={sectionErrors}
                                handleRemoveSection={handleRemoveSection}
                            />
                        </div>
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
        </div>
    );
};

export default AddLesson;
