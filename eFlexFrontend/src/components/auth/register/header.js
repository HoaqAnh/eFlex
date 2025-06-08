import React from "react";

//style
import "../../../styles/authentication/header.css"

import Logo from "../../../assets/logo/eFlex.png"

const Header = () => (
    <div className="register-header">
        <div className="register-header__left">
            <img src={Logo} alt="eFlex Logo" className="logo" loading='lazy' />
        </div>
        <div className="register-header__right">
            <h1>Have a good day !</h1>
        </div>
    </div>
)

export default Header;