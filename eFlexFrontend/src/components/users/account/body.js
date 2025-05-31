import React, { useState } from "react";

//component
import Overview from "./overview"
import Security from "./security"

//style
import "../../../styles/users/account/body.css"

const Body = () => {
    const [activeComponent, setActiveComponent] = useState("overview");
    const handleOverviewClick = () => {
        setActiveComponent("overview");
    };
    const handleSecurityClick = () => {
        setActiveComponent("security");
    };
    return (
        <div className="account-body">
            <div className="account-body__container">
                <div className="account-body__container_left">
                    <button className={`overview-btn ${activeComponent === "overview" ? "active" : ""}`}
                        onClick={handleOverviewClick}
                    >
                        Tổng quan
                    </button>
                    <button
                        className={`overview-btn ${activeComponent === "security" ? "active" : ""}`}
                        onClick={handleSecurityClick}
                    >
                        Bảo mật
                    </button>
                </div>
                <div className="account-body__container-divider__vertical" />
                <div className="account-body__container_right">
                    {activeComponent === "overview" && <Overview />}
                    {activeComponent === "security" && <Security />}
                </div>
            </div>
        </div>
    );
}

export default Body;