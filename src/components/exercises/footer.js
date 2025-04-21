import React from "react";

//style
import "../../styles/exercises/footer.css"

function Footer() {
    return (
        <div className="exercises__footer">
            <div className="exercises__footer-content">
                <div className="exercises__footer-actions">
                    <button className="button-ZoomIn" id="up">
                        <svg className="zoom-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                            <g fill="currentColor" fillRule="evenodd">
                                <path d="M120.46 158.29c-30.166 8.65-61.631-8.792-70.281-38.957s8.792-61.63 38.957-70.28s61.63 8.792 70.28 38.957c4.417 15.403-1.937 38.002-9.347 50.872c-.614 1.067 59.212 53.064 59.212 53.064l-17.427 17.63l-53.514-56.72s-10.233 3.241-17.88 5.434M104 144c22.091 0 40-17.909 40-40s-17.909-40-40-40s-40 17.909-40 40s17.909 40 40 40" />
                                <path d="M111.912 80.047h-15.95v16.037H80v15.992h15.962V128h15.95v-15.924H128V96.084h-16.088z" />
                            </g>
                        </svg>
                    </button>
                    <p>16</p>
                    <button className="button-ZoomOut" id="down">
                        <svg className="zoom-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                            <g fill="currentColor" fillRule="evenodd">
                                <path d="M120.46 158.29c-30.166 8.65-61.631-8.792-70.281-38.957s8.792-61.63 38.957-70.28s61.63 8.792 70.28 38.957c4.417 15.403-1.937 38.002-9.347 50.872c-.614 1.067 59.212 53.064 59.212 53.064l-17.427 17.63l-53.514-56.72s-10.233 3.241-17.88 5.434M104 144c22.091 0 40-17.909 40-40s-17.909-40-40-40s-40 17.909-40 40s17.909 40 40 40" />
                                <path d="M80 96.084v15.992h48V96.084z" />
                            </g>
                        </svg>
                    </button>
                </div>
                <div className="exercises__footer-formCheck">
                    <input type="checkbox" id="auto_next_question"></input>
                    <label>Tự động chuyển câu khi chọn xong đáp án</label>
                </div>
            </div>
        </div>
    );
}

export default Footer;