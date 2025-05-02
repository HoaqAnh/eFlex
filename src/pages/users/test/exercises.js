import React from "react";

//components
import Navbar from "../../../components/navbar";
import Header from "../../../components/exercises/header";
import Body from "../../../components/exercises/body";
import Footer from "../../../components/exercises/footer";

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
            <Navbar />
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