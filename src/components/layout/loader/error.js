import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/layout/loader/error.css"

const Error = ({ Title }) => {
    const navitage = useNavigate();
    const handleBackHome = () => {
        navitage("/");
    }
    return (
        <div className="isError">
            <div className="isError_container">
                <div className="isError__title">
                    {Title}
                </div>
                <div className="isError__loader"></div>
                <button className="isError-button" onClick={handleBackHome}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M321.94 98L158.82 237.78a24 24 0 0 0 0 36.44L321.94 414c15.57 13.34 39.62 2.28 39.62-18.22v-279.6c0-20.5-24.05-31.56-39.62-18.18" />
                    </svg>
                    Trở về trang chủ
                </button>
            </div>
        </div>
    );
}
export default Error;