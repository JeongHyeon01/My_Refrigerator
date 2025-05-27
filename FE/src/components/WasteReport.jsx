// src/components/WasteReport.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WasteReport = () => {
  const data = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        label: '소비된 재료 수',
        data: [12, 19, 14, 20, 18],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: '폐기된 재료 수',
        data: [4, 7, 6, 9, 3],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '📊 월별 음식물 소비/폐기 통계',
      },
    },
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 음식물 낭비 리포트</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default WasteReport;
