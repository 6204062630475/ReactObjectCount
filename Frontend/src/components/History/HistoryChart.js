import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);
const LineChart = ({ data }) => {
  // แยกข้อมูล x (วันที่และเวลา) และ y (ค่าที่เกี่ยวข้อง) ออกจาก Object
  const xData = data.map(item => item.DATETIME);
  const yData = data.map(item => item.FISH);

  // ข้อมูลสำหรับ Line Chart
  const chartData = {
    labels: xData,
    datasets: [
      {
        label: 'Fish',
        data: yData,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  // ตัวเลือกสำหรับการแสดงผลของ Line Chart
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
