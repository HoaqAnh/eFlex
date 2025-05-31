import React from 'react';
import { Pie } from 'react-chartjs-2';

const ChartItem = ({ title, data, options }) => {
  return (
    <div className="chart-item">
      <h4>{title}</h4>
      <div className="chart-wrapper">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartItem; 