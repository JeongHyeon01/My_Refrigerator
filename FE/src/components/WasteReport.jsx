import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const data = {
    labels: [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ],
    datasets: [
      {
        label: '소비된 재료 수',
        data: [12, 19, 14, 20, 18, 22, 25, 21, 19, 16, 13, 15],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: '폐기된 재료 수',
        data: [4, 7, 6, 9, 3, 5, 4, 6, 5, 3, 2, 4],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '📊 월별 음식물 소비/폐기 통계',
      },
    },
  };

  return (
    <div className="page-center">
      <div className="form-card" style={{ width: '100%', maxWidth: '900px' }}>
        <h1 style={{ textAlign: 'center' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>📊 음식물 낭비 리포트</h2>

        <div style={{ height: '300px', margin: '1rem 0' }}>
          <Bar data={data} options={options} />
        </div>

        <button
          onClick={() => navigate('/main')}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '0.6rem',
            width: '100%',
            borderRadius: '6px',
          }}
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default WasteReport;
