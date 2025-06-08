import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './WasteReport.css';

const WasteReport = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState(null);

  const fetchMonthlyData = async (uid) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!uid) {
        setMonthlyData([]);
        setIsLoading(false);
        return;
      }
      // 소비된 식재료 조회
      const consumedQuery = query(
        collection(db, 'consumed_ingredients'),
        where('userId', '==', uid)
      );
      const consumedSnapshot = await getDocs(consumedQuery);
      const consumedData = consumedSnapshot.docs.map(doc => ({
        ...doc.data(),
        consumedAt: new Date(doc.data().consumedAt)
      }));
      // 폐기된 식재료 조회 (폐기 이력 컬렉션에서 가져오기)
      const discardedQuery = query(
        collection(db, 'discarded_ingredients'),
        where('userId', '==', uid)
      );
      const discardedSnapshot = await getDocs(discardedQuery);
      const discardedData = discardedSnapshot.docs.map(doc => ({
        ...doc.data(),
        discardedAt: new Date(doc.data().discardedAt)
      }));
      // 월별 데이터 초기화
      const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: `${i + 1}월`,
        consumed: 0,
        discarded: 0
      }));
      // 소비된 식재료 월별 집계
      consumedData.forEach(item => {
        const month = item.consumedAt.getMonth();
        monthlyStats[month].consumed += item.consumedQuantity || 1;
      });
      // 폐기된 식재료 월별 집계
      discardedData.forEach(item => {
        const month = item.discardedAt.getMonth();
        monthlyStats[month].discarded += item.discardedQuantity || 1;
      });
      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      setError('데이터 조회에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setAuthChecked(true);
      } else {
        setAuthChecked(true);
        setUserId(null);
        setError('로그인이 필요합니다.');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authChecked && userId) {
      fetchMonthlyData(userId);
    }
  }, [authChecked, userId]);

  if (!authChecked) {
    return (
      <div className="report-layout">
        <div className="header-actions">
          <h2>📊 낭비 리포트</h2>
        </div>
        <p>인증 상태 확인 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-layout">
        <div className="header-actions">
          <h2>📊 낭비 리포트</h2>
        </div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate('/login')}>로그인 페이지로</button>
      </div>
    );
  }

  return (
    <div className="report-layout">
      <div className="header-actions">
        <h2>📊 낭비 리포트</h2>
        <button 
          onClick={() => navigate('/main')} 
          className="action-btn"
        >
          🏠 메인 페이지로 돌아가기
        </button>
      </div>

      {isLoading ? (
        <p>로딩중...</p>
      ) : (
        <div className="chart-container">
          <h3>월별 식재료 소비 및 폐기 현황</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="consumed" 
                name="소비된 식재료" 
                fill="#2196F3" 
              />
              <Bar 
                dataKey="discarded" 
                name="폐기된 식재료" 
                fill="#F44336" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WasteReport;
