import React from "react";
import List from "./list";
import "../../../styles/users/test/body.css";
import AvatarDefault from "../../../assets/images/defaultAvatar.png";

const Body = ({ User, Tests }) => {
    const testCount = Tests ? Tests.length : 0;
    const testsData = Tests ? Tests : [];
    return (
        <div className="test-body">
            <div className="test-body__left">
                <div className="test-body__left-top">
                    <img src={AvatarDefault} alt="Avatar profile" loading="lazy" />
                </div>
                <div className="test-body__left-body">
                    <p>Xin chào, {User.fullname}!</p>
                </div>
                <div className="test-body__left-bottom">
                    <p>Bạn có {testCount} bài kiểm tra</p>
                </div>
            </div>
            <div className="test-body__right">
                {testsData.length > 0 ? (
                    testsData.map((testItem) => (
                        <List
                            key={testItem.id}
                            testData={testItem}
                        />
                    ))
                ) : (
                    <p>Không có bài kiểm tra nào.</p>
                )}
            </div>
        </div>
    );
};

export default Body;