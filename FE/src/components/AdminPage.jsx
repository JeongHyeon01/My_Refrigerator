import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import seedRecipes from '../scripts/seedRecipes';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    try {
      setIsLoading(true);
      await seedRecipes();
      setMessage('레시피 데이터가 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('데이터 추가 실패:', error);
      setMessage('데이터 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h2>관리자 페이지</h2>
        <p style={{ marginBottom: '2rem' }}>
          이 페이지는 레시피 데이터를 Firebase에 추가하기 위한 관리자 페이지입니다.
        </p>

        <button
          onClick={handleSeedData}
          disabled={isLoading}
          style={{
            padding: '0.8rem 1.2rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            marginBottom: '1rem'
          }}
        >
          {isLoading ? '처리 중...' : '기본 레시피 데이터 추가'}
        </button>

        {message && (
          <p style={{
            color: message.includes('실패') ? 'red' : 'green',
            marginBottom: '1rem'
          }}>
            {message}
          </p>
        )}

        <button
          onClick={() => navigate('/main')}
          style={{
            padding: '0.8rem 1.2rem',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          메인 페이지로
        </button>
      </div>
    </div>
  );
};

export default AdminPage; 