import React from "react"
import Header from "../../../components/users/course/header"
import Body from "../../../components/users/course/body"
import { useAdminCourse } from "../../../hooks/course/useCourse";
import { useAuth } from "../../../hooks/useAuth";
import "../../../styles/users/course/style.css";

const Course = () => {
    const { checkAuth } = useAuth();
    const { courseData, loading, error } = useAdminCourse()
    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }
    return (
        <div className="course">
            <Header />
            <Body
                courseData={courseData}
                loading={loading}
                error={error}
            />
        </div>
    );
}

export default Course;