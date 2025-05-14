import React from "react";
import "../../../styles/layout/loader/error.css"
const Error = ({ Title }) => (
    <div className="isError">
        <div className="isError__title">
            {Title}
        </div>
        <div className="isError__loader"></div>
    </div>
)

export default Error;