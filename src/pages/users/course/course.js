import React from "react"
import Header from "../../../components/users/course/header"
import Body from "../../../components/users/course/body"
import { useAuth } from "../../../hooks/useAuth";
import "../../../styles/users/course/style.css";

const Course = () => {
    const { checkAuth } = useAuth();

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }
    return (
        <div className="course">
            <Header />
            <Body />
        </div>
    );
}

export default Course;