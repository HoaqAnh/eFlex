import React from "react";
import "../../../styles/layout/loader/loading.css"
const Loading = ({ Title }) => (
    <div className="isLoading">
        <div className="isLoading__title">
            {Title}
        </div>
        <div className="isLoading__loader"></div>
    </div>
)

export default Loading;