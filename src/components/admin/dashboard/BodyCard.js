import React from 'react';
import ChartsContainer from './ChartsContainer';

const BodyCard = ({ chartData, chartOptions }) => {
  return (
    <div className="body-card">
      <div className="body-card-header">
        <h2>Thống kê tiến độ học tập</h2>
      </div>
      <div className="body-card-body">
        <ChartsContainer chartData={chartData} chartOptions={chartOptions} />
      </div>
    </div>
  );
};

export default BodyCard; 