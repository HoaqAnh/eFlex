import { useWebSocket } from "../../../context/WebSocketContext";

const TopCard = () => {
  const { activeUsers } = useWebSocket();
  const data = {
    totalStudents: 0,
    newRegistrations: 0
  }
  return (
    <div className="top-card">
      <div className="counter-user">
        <div className="counter-row">
          <span>Đang truy cập: </span>
          <span>{activeUsers || 0}</span>
        </div>
        <div className="counter-row">
          <span>Tổng số học viên: </span>
          <span>{data.totalStudents}</span>
        </div>
        <div className="counter-row">
          <span>Đăng ký mới trong tháng: </span>
          <span>
            {data.newRegistrations}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopCard; 