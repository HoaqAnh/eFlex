import React from 'react';
import CounterUser from "../counterUser";

const TopCard = () => {
  return (
    <div className="top-card">
      <div className="top-card-left">
        <h2>Học viên</h2>
      </div>
      <div className="top-card-right">
        <CounterUser />
      </div>
    </div>
  );
};

export default TopCard; 