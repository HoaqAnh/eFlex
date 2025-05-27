import React from 'react';

//style
import "../../../styles/authentication/header.css"

import Logo from "../../../assets/logo/eFlex.png"

const Header = () => (
    <div className="login-header">
        <div className="login-header__left">
            <img src={Logo} alt="eFlex Logo" className="logo" loading='lazy'/>
        </div>
        <div className="login-header__right">
            <h1>Welcome back !</h1>
        </div>
    </div>
);

export default Header;