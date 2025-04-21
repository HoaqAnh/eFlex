import React from "react";

//components
import MultipleChoice from "./multipleChoice"

//style
import "../../styles/exercises/body.css"

function Body() {
    return(
        <div className="exercises__body">
            <div className="exercises__body-content">
                <MultipleChoice />
                <div className="exercises__body-content-actions">
                    <button className="btn btn-secondary">Câu hỏi trước đó</button>
                    <button className="btn btn-secondary">Câu hỏi tiếp theo</button>
                </div>
            </div>
        </div>
    );
}

export default Body;