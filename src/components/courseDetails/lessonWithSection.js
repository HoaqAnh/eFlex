import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSections } from "../../hooks/course/useSection";
import { useGetProgress } from "../../hooks/progress/useProgress";
import Loading from "../layout/loader/loading";
import Error from "../layout/loader/error";
import SectionItem from "./sectionItem";
import { IconCompleted, IconNotCompleted } from "./icons";
import "../../styles/courseDetails/lessonWithSection.css";

const LessonWithSection = ({ user, lesson, course }) => {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();

    const {
        listSection,
        loading: sectionsListLoading,
        error: sectionsListError,
    } = useSections(lesson.id);

    const {
        isEntityCompleted: isLessonCompleted,
        isProgressLoading: isLessonProgressLoading,
    } = useGetProgress(user.id, lesson.id, "lesson");


    const handleLessonDetails = () => {
        if (course?.id && lesson?.id) {
            navigate(`/course/${course.id}/lesson/${lesson.id}`);
        }
    };

    const handleExercises = () => {
        if (course?.id && lesson?.id) {
            navigate(`/course/${course.id}/lesson/${lesson.id}/test`);
        }
    };

    const LessonStatusIcon = () => {
        if (isLessonProgressLoading) return <span className="status-icon loading-icon"></span>;
        return isLessonCompleted ? <IconCompleted /> : <IconNotCompleted />;
    };

    return (
        <div className="eflex-playlist__lesson">
            <div className={`lesson-body__content ${collapsed ? 'collapsed' : ''}`}>
                <div className="lesson-body__content-top" onClick={() => setCollapsed(!collapsed)}>
                    <div className="nzjxcziiaso-2183">
                        <LessonStatusIcon />
                        <h3 className="lesson-title">
                            {lesson?.tenBai || "Tên bài học không xác định"}
                        </h3>
                    </div>
                    <div className={`expand-button ${collapsed ? '' : 'expanded'}`}></div>
                </div>

                {!collapsed && (
                    <div className="lesson-body__content-content">
                        {sectionsListLoading && <Loading Title="Đang tải danh sách mục..." />}
                        {sectionsListError && <Error Title='Lỗi tải danh sách mục. Vui lòng thử lại sau!' />}
                        {!sectionsListLoading && !sectionsListError && (
                            Array.isArray(listSection) && listSection.length > 0 ? (
                                listSection.map((sectionItem) => (
                                    <SectionItem
                                        key={sectionItem.id}
                                        userId={user.id}
                                        courseId={course?.id}
                                        lessonId={lesson?.id}
                                        section={sectionItem}
                                    />
                                ))
                            ) : (
                                <p className="sectionNull">Bài học này không có mục nào.</p>
                            )
                        )}
                    </div>
                )}

                <div className="lesson-body__content-actions">
                    <button className="btn btn-section-primary" onClick={handleLessonDetails}>Bắt đầu học</button>
                    <button className="btn btn-section-secondary" onClick={handleExercises}>Làm bài tập</button>
                </div>
            </div>
        </div>
    );
};

export default LessonWithSection;