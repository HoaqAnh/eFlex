import React from "react";

//style
import "../../styles/exercises/header.css"

function Header() {
    return (
        <div className="exercises__header">
            <div className="exercises__header-content">
                <div className="exercises__header-right">
                    <div className="exercises__header-right-subcontent">
                        <h2>Tên bài học</h2>
                    </div>
                    <div className="exercises__header-right-subcontent">
                        <p>Số câu hỏi:</p>
                        <p>40</p>
                    </div>
                    <div className="exercises__header-right-subcontent">
                        <p>Thời gian:</p>
                        <p>40 phút</p>
                    </div>
                    <div className="exercises__header-right-subcontent">
                        <p>Số câu còn lại:</p>
                        <p>0</p>
                    </div>
                </div>
                <div className="exercises__header-left">
                    <div className="exercises__header-left-content">
                        <h4>Thời gian còn lại</h4>
                        <p className="exercises__timeleft">0:00</p>
                    </div>
                    <div className="exercises__header-left-actions">
                        <button className="btn btn-section-primary">Nộp bài</button>
                        <button className="btn btn-section-danger">Hủy bài làm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;