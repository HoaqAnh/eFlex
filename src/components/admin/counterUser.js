import React from "react";
import { useWebSocket } from "../../context/WebSocketContext";

function CounterUser({ totalStudents, newRegistrations }) {
    const { activeUsers } = useWebSocket();

    return (
        <div className="counter-user">
            <div className="counter-row">
                <span>Đang truy cập: </span>
                <span>{activeUsers || 0}</span>
            </div>
            <div className="counter-row">
                <span>Tổng số học viên: </span>
                <span>{totalStudents ? totalStudents.toLocaleString() : "0"}</span>
            </div>
            <div className="counter-row">
                <span>Đang ký mới trong tháng: </span>
                <span>
                    {newRegistrations ? newRegistrations.toLocaleString() : "0"}
                </span>
            </div>
        </div>
    );
}

export default CounterUser;