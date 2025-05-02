import React from "react";

//components
import Header from "../../../components/users/test/exercises/header";
import Body from "../../../components/users/test/exercises/body";
import Footer from "../../../components/users/test/exercises/footer";

//hooks
import { useAuth } from "../../../hooks/useAuth";

//style
import "../../../styles/exercises/style.css"

const Exercises = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }
    return (
        <div className="exercises">
            <div className="exercises__main-content">
                <Header />
                <div className="exercises__content-wrapper">
                    <Body />
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Exercises;