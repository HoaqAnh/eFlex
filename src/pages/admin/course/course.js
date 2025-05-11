import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useAdminCourse } from "../../../hooks/course/useCourse"
import Body from "../../../components/users/course/body";
import Footer from "../../../components/admin/course/footer";
import ConfirmDialog from "../../../components/admin/course/confirmDialog";
import "../../../styles/admin/course/style.css";

const Course = () => {
    const { checkAuth } = useAuth();
    const { handleNavigate, handleDelete, courseData, loading, error } = useAdminCourse();
    const [isSelectingCourse, setIsSelectingCourse] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [hideUnselected, setHideUnselected] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    const handleToggleSelectCourse = () => {
        setIsSelectingCourse(!isSelectingCourse);
        if (isSelectingCourse) {
            setSelectedCourseId(null);
        }
    };

    const handleSelectCourse = (courseId) => {
        setSelectedCourseId(courseId);
        setHideUnselected(!hideUnselected);
        setIsSelectingCourse(false);
    };

    const handleUnselectCourse = () => {
        setSelectedCourseId(null);
        setHideUnselected(false);
    };

    const handleToggleHideUnselected = () => {
        setHideUnselected(!hideUnselected);
    };

    const onDeleteClick = () => {
        if (selectedCourseId) {
            setIsConfirmOpen(true);
        }
    };

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (selectedCourseId) {
            const success = await handleDelete(selectedCourseId);
            if (success) {
                setSelectedCourseId(null);
                setHideUnselected(false);
            }
        }
        setIsConfirmOpen(false);
    };

    return (
        <div className="admin-course">
            <Body
                courseData={courseData}
                loading={loading}
                error={error}
                isSelectingCourse={isSelectingCourse}
                selectedCourseId={selectedCourseId}
                onSelectCourse={handleSelectCourse}
                hideUnselected={hideUnselected}
            />
            <Footer
                isSelectingCourse={isSelectingCourse}
                onToggleSelectCourse={handleToggleSelectCourse}
                onUnselectCourse={handleUnselectCourse}
                onToggleHideUnselected={handleToggleHideUnselected}
                courseId={selectedCourseId}
                hideUnselected={hideUnselected}
                onDeleteClick={onDeleteClick}
                handleAddCourse={() => handleNavigate("course/addCourse")}
                handlEditCourse={() => handleNavigate(`course/editCourse/${selectedCourseId}`)}
            />
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={closeConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa khóa học này?`}
            />
        </div >
    );
};

export default Course;