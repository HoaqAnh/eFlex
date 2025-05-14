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
import Error from "../../../components/layout/loader/error";

const Exercises = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    const { testId } = useParams();
    const { exerciseData, loading, error } = useExercise(testId);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    if (error) {
        return (
            <div className="exercises">
                <Error Title="Có lỗi xảy ra, vui lòng thử lại sau ít phút." />
            </div>
        )
    }

    return (
        <div className="exercises">
            <div className="exercises__main-content">
                <Header />
                <div className="exercises__content-wrapper">
                    <Body
                        exerciseData={exerciseData}
                    />
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Exercises;