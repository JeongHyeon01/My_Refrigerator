import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [sortOption, setSortOption] = useState([]);
  const [quantities, setQuantities] = useState({});

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  const handleIngredientSubmit = (form) => {
    setIngredients((prev) => [...prev, form]);
  };

  const handleQuantityChange = (index, value) => {
    setQuantities((prev) => ({ ...prev, [index]: value }));
  };

  const updateQuantity = (index, newQty) => {
    setIngredients((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleDelete = (index) => {
    const removeQty = Number(quantities[index] || 1);
    const current = ingredients[index];

    if (removeQty >= current.quantity) {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    } else {
      updateQuantity(index, current.quantity - removeQty);
    }
  };

  const handleDiscard = (index) => {
    const discardQty = Number(quantities[index] || 1);
    const current = ingredients[index];

    alert(`"${current.name}"를 ${discardQty}개 폐기했습니다.`);

    if (discardQty >= current.quantity) {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    } else {
      updateQuantity(index, current.quantity - discardQty);
    }
  };

  const handleUse = (index) => {
    const useQty = Number(quantities[index] || 1);
    const current = ingredients[index];

    alert(`"${current.name}"를 ${useQty}개 사용했습니다.`);

    if (useQty >= current.quantity) {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    } else {
      updateQuantity(index, current.quantity - useQty);
    }
  };

  const handleModify = (index) => {
    const newQty = Number(quantities[index]);
    if (isNaN(newQty) || newQty < 1) {
      alert("올바른 수량을 입력하세요.");
      return;
    }
    updateQuantity(index, newQty);
    alert("수정되었습니다.");
  };

  const sortedIngredients = [...ingredients].sort((a, b) => {
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    if (sortOption === 'expiry-soon') return new Date(a.expiryDate) - new Date(b.expiryDate);
    if (sortOption === 'expiry-late') return new Date(b.expiryDate) - new Date(a.expiryDate);
    return 0;
  });

  return (
    <div className="main-layout">
      <div className="main-left">
        <h2>👋 환영합니다!</h2>

        <form
          className="ingredient-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = {
              name: e.target.name.value,
              quantity: parseInt(e.target.quantity.value),
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
          <button onClick={() => navigate('/recipes')} className="action-btn">🍽 레시피 추천 보기</button>
          <button onClick={() => navigate('/report')} className="action-btn">📊 낭비 리포트 보기</button>
          <button onClick={handleLogout} className="logout-btn">🚪 로그아웃</button>
        </div>
      </div>

      <div className="main-right">
        <h3>📋 등록된 식재료</h3>

        <select onChange={(e) => setSortOption(e.target.value)} style={{ marginBottom: '1rem', padding: '0.4rem' }}>
          <option value="">정렬 선택</option>
          <option value="name-asc">이름 오름차순</option>
          <option value="name-desc">이름 내림차순</option>
          <option value="expiry-soon">유통기한 임박 순</option>
          <option value="expiry-late">유통기한 여유 순</option>
        </select>

        {sortedIngredients.length === 0 ? (
          <p>아직 등록된 식재료가 없습니다.</p>
        ) : (
          sortedIngredients.map((item, index) => (
            <div key={index} className="ingredient-card">
              <strong>{item.name}</strong> - {item.quantity}개 ({item.expiryDate})
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="number"
                  min="1"
                  placeholder="수량"
                  value={quantities[index] || ''}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  style={{ width: '60px', marginRight: '0.5rem' }}
                />
                <button onClick={() => handleUse(index)} style={{ marginRight: '0.3rem' }}>사용</button>
                <button onClick={() => handleModify(index)} style={{ marginRight: '0.3rem' }}>수정</button>
                <button onClick={() => handleDiscard(index)} style={{ marginRight: '0.3rem' }}>폐기</button>
                <button onClick={() => handleDelete(index)}>삭제</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
