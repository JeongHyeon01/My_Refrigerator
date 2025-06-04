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
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  const handleIngredientSubmit = (form) => {
    setIngredients((prev) => [...prev, form]);
  };

  const handleDeleteIngredient = (indexToDelete) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <div className="main-layout">
      
      <div className="main-left">
        <h2>🍳 나의 냉장고에 오신 것을 환영합니다!</h2>

        
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

        
        <div className="main-actions">
          <button onClick={() => navigate('/recipes')} className="action-btn">
            🍽 레시피 추천 보기
          </button>
          <button onClick={() => navigate('/report')} className="action-btn">
            📊 낭비 리포트 보기
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 로그아웃
          </button>
        </div>
      </div>

      
      <div className="main-right">
        <h3>📋 등록된 식재료</h3>
        {ingredients.length === 0 ? (
          <p>아직 등록된 식재료가 없습니다.</p>
        ) : (
          ingredients.map((item, index) => (
            <div key={index} className="ingredient-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{item.name}</strong> - {item.quantity}개 ({item.expiryDate})
                </div>
                <button
                  onClick={() => handleDeleteIngredient(index)}
                  style={{
                    marginLeft: '1rem',
                    padding: '0.3rem 0.6rem',
                    backgroundColor: '#e53935',
                    color: 'white',
                    border: 'none',
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
