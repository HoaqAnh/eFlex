import React from "react";

//component
import List from "./list"

//style
import "../../../styles/users/test/body.css"

const Body = () => {
    const testCount = 2;
    return (
        <div className="test-body">
            <div className="test-body__left">
                <div className="test-body__left-top">
                    <img src="./avatar" alt="Avatar profile" loading="lazy" />
                </div>
                <div className="test-body__left-body">
                    <p>Nguyễn Văn A</p>
                </div>
                <div className="test-body__left-bottom">
                    <p>Bạn có {testCount} bài kiểm tra</p>
                </div>
            </div>
            <div className="test-body__right">
                <List />
            </div>
        </div>
    );
}

export default Body;