import React from "react";

//hooks
import { useAuth } from "../../../hooks/useAuth";

//components
import Header from "../../../components/users/test/header"
import Body from "../../../components/users/test/body"
import Footer from "../../../components/users/test/footer"

//style
import "../../../styles/users/test/style.css"

const Test = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }
    return (
        <div className="test">
            <div className="test__content-card">
                <Header />
                <Body />
                <Footer />
            </div>
        </div>
    );
}

export default Test;