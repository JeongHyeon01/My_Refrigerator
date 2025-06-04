import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);

  const handleLogout = async () => {
    await signOut(auth);
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  const handleIngredientSubmit = (form) => {
    setIngredients((prev) => [...prev, form]);
  };

  const handleDelete = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDiscard = (index) => {
    const discarded = ingredients[index];
    alert(`"${discarded.name}"를 폐기 처리했습니다.`);
    setIngredients((prev) => prev.filter((_, i) => i !== index));
    // 🔧 폐기 기록 저장은 추후 Firestore에 연동 가능
  };

  return (
    <div className="main-layout">
      <div className="main-left">
        <h2>👋 환영합니다!</h2>

        {/* 식재료 등록 폼 */}
        <form
          className="ingredient-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = {
              name: e.target.name.value,
              quantity: e.target.quantity.value,
              expiryDate: e.target.expiryDate.value,
            };
            if (!data.name || !data.quantity || !data.expiryDate) {
              alert("모든 항목을 입력해주세요.");
              return;
            }
            handleIngredientSubmit(data);
            e.target.reset();
          }}
        >
          <h3>📝 식재료 등록</h3>
          <input type="text" name="name" placeholder="식재료 이름" />
          <input type="number" name="quantity" placeholder="수량" />
          <input type="date" name="expiryDate" />
          <button type="submit">등록</button>
        </form>

        {/* 기능 버튼들 */}
        <div className="main-actions">
          <button onClick={() => navigate('/recipes')} className="action-btn">🍽 레시피 추천 보기</button>
          <button onClick={() => navigate('/report')} className="action-btn">📊 낭비 리포트 보기</button>
          <button onClick={handleLogout} className="logout-btn">🚪 로그아웃</button>
        </div>
      </div>

      {/* 등록된 식재료 목록 */}
      <div className="main-right">
        <h3>📋 등록된 식재료</h3>
        {ingredients.length === 0 ? (
          <p>아직 등록된 식재료가 없습니다.</p>
        ) : (
          ingredients.map((item, index) => (
            <div key={index} className="ingredient-card">
              <strong>{item.name}</strong> - {item.quantity}개 ({item.expiryDate})
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleDiscard(index)}
                  style={{
                    marginRight: '0.5rem',
                    backgroundColor: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px'
                  }}
                >
                  폐기
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  style={{
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px'
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
