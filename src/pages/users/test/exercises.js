import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

//components
import Header from "../../../components/users/test/exercises/header";
import Body from "../../../components/users/test/exercises/body";
import Footer from "../../../components/users/test/exercises/footer";

//hooks
import { useAuth } from "../../../hooks/useAuth";
import { useExercise } from "../../../hooks/test/useExercise"

//style
import "../../../styles/exercises/style.css"

const Exercises = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    const { testId } = useParams();
    const { exercises, exerciseData, loading, error } = useExercise();

    useEffect(() => {
        exercises(testId);
    }, [exercises, testId]);
    
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }
    return (
        <div className="exercises">
            <div className="exercises__main-content">
                <Header />
                <div className="exercises__content-wrapper">
                    <Body 
                    exerciseData = {exerciseData}
                    loading = {loading}
                    error = {error}
                    />
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Exercises;