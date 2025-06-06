import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ConsumedIngredients = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userId = auth.currentUser?.uid;
      console.log('현재 사용자 ID:', userId);

      if (!userId) {
        console.log('사용자 ID가 없습니다.');
        setIngredients([]);
        setIsLoading(false);
        return;
      }

      // 소비된 식재료 조회
      const consumedQuery = query(
        collection(db, 'consumed_ingredients'),
        where('userId', '==', userId)
      );
      const consumedSnapshot = await getDocs(consumedQuery);
      const consumedData = consumedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'consumed',
        date: doc.data().consumedAt || new Date().toISOString()
      }));

      // 폐기된 식재료 조회
      const discardedQuery = query(
        collection(db, 'discarded_ingredients'),
        where('userId', '==', userId)
      );
      const discardedSnapshot = await getDocs(discardedQuery);
      const discardedData = discardedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'discarded',
        date: doc.data().discardedAt || new Date().toISOString()
      }));

      // 두 데이터 합치기
      const allData = [...consumedData, ...discardedData];
      
      // 날짜순 정렬
      allData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setIngredients(allData);
    } catch (error) {
      console.error('식재료 조회 실패:', error);
      setError('식재료 조회에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const collectionName = type === 'consumed' ? 'consumed_ingredients' : 'discarded_ingredients';
      await deleteDoc(doc(db, collectionName, id));
      await fetchIngredients(); // 데이터 다시 로드
      alert('기록이 삭제되었습니다.');
    } catch (error) {
      console.error('기록 삭제 실패:', error);
      alert('기록 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchIngredients();
      } else {
        setIngredients([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="recommend-layout">
      <div className="recommend-card">
        <h2 className="recommend-title">🥕 소비/폐기된 식재료 목록</h2>
        {isLoading ? (
          <p>로딩중...</p>
        ) : error ? (
          <div>
            <p className="recommend-error">{error}</p>
            <button onClick={fetchIngredients} className="recommend-btn">다시 시도</button>
          </div>
        ) : ingredients.length === 0 ? (
          <p>아직 기록된 식재료가 없습니다.</p>
        ) : (
          <ul className="recommend-list">
            {ingredients.map((item) => (
              <li key={item.id} className="recommend-item">
                <div className="recommend-link">
                  <div className="ingredient-info">
                    <strong>{item.name}</strong>
                    <div>수량: {item.consumedQuantity || item.discardedQuantity}개</div>
                    <div>처리 일시: {new Date(item.date).toLocaleString()}</div>
                    <div>유통기한: {item.expiryDate}</div>
                    <div>상태: {item.type === 'consumed' ? '소비' : '폐기'}</div>
                  </div>
                  <div className="ingredient-actions" style={{ marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => handleDelete(item.id, item.type)}
                      className="delete-btn"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/main')} 
            className="recommend-btn"
          >
            🏠 메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumedIngredients; 