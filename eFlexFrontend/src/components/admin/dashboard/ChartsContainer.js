import React from 'react';
import ChartItem from './ChartItem';

const ChartsContainer = ({ chartData, chartOptions }) => {
  const createChartData = (data) => ({
    labels: data.labels,
    datasets: [{
      data: data.data,
      backgroundColor: data.backgroundColor,
      borderWidth: 0
    }]
  });

  return (
    <div className="charts-container">
      <ChartItem
        title="Tiếng anh"
        data={createChartData(chartData.english)}
        options={chartOptions}
      />
      <ChartItem
        title="Kỹ thuật lập trình"
        data={createChartData(chartData.programming)}
        options={chartOptions}
      />
      <ChartItem
        title="Giải tích"
        data={createChartData(chartData.math)}
        options={chartOptions}
      />
    </div>
  );
};

export default ChartsContainer; 