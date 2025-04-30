import React from "react";

//components
import Header from "../../components/auth/login/header"
import Body from "../../components/auth/login/body"

//style
import "../../styles/authentication/style.css"

const Login = () => (
    <div className="login">
        <div className="login__main-content">
            <Header />
            <Body />
        </div>
    </div>
);


export default Login;