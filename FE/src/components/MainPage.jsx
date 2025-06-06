import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [sortOption, setSortOption] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 실시간 리스너 설정
        const q = query(collection(db, 'ingredients'), where('userId', '==', user.uid));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setIngredients(data);
          setIsLoading(false);
        }, (error) => {
          console.error('실시간 데이터 구독 실패:', error);
          setIsLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setIngredients([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  const handleIngredientSubmit = async (form) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }
      const newIngredient = {
        ...form,
        quantity: Number(form.quantity),
        userId,
      };
      const docRef = await addDoc(collection(db, 'ingredients'), newIngredient);
      setIngredients(prev => [...prev, { id: docRef.id, ...newIngredient }]);
      alert('식재료가 등록되었습니다.');
    } catch (error) {
      console.error('식재료 등록 실패:', error);
      alert('식재료 등록에 실패했습니다.');
    }
  };

  const handleQuantityChange = (index, value) => {
    setQuantities((prev) => ({ ...prev, [index]: value }));
  };

  const updateQuantity = async (index, newQty) => {
    try {
      const ingredient = ingredients[index];
      const docRef = doc(db, 'ingredients', ingredient.id);
      await updateDoc(docRef, { quantity: newQty });
      setIngredients((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, quantity: newQty } : item
        )
      );
    } catch (error) {
      console.error('수량 수정 실패:', error);
      alert('수량 수정에 실패했습니다.');
    }
  };

  const handleUse = async (index) => {
    try {
      const useQty = Number(quantities[index] || 1);
      const current = ingredients[index];
      const docRef = doc(db, 'ingredients', current.id);
      
      if (useQty >= current.quantity) {
        // 소비된 식재료 기록
        await addDoc(collection(db, 'consumed_ingredients'), {
          name: current.name,
          consumedQuantity: current.quantity,
          consumedAt: new Date().toISOString(),
          expiryDate: current.expiryDate,
          userId: auth.currentUser.uid
        });
        
        await deleteDoc(docRef);
      } else {
        // 소비된 식재료 기록
        await addDoc(collection(db, 'consumed_ingredients'), {
          name: current.name,
          consumedQuantity: useQty,
          consumedAt: new Date().toISOString(),
          expiryDate: current.expiryDate,
          userId: auth.currentUser.uid
        });
        
        await updateDoc(docRef, { quantity: current.quantity - useQty });
      }
      alert('식재료가 사용 처리되었습니다.');
    } catch (error) {
      console.error('식재료 사용 처리 실패:', error);
      alert('식재료 사용 처리에 실패했습니다.');
    }
  };

  const handleDiscard = async (index) => {
    try {
      const discardQty = Number(quantities[index] || 1);
      const current = ingredients[index];
      const docRef = doc(db, 'ingredients', current.id);
      
      // 폐기된 식재료 기록
      await addDoc(collection(db, 'discarded_ingredients'), {
        name: current.name,
        discardedQuantity: discardQty,
        discardedAt: new Date().toISOString(),
        expiryDate: current.expiryDate,
        userId: auth.currentUser.uid
      });

      if (discardQty >= current.quantity) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { quantity: current.quantity - discardQty });
      }
      alert(`"${current.name}"를 ${discardQty}개 폐기했습니다.`);
    } catch (error) {
      console.error('식재료 폐기 실패:', error);
      alert('식재료 폐기에 실패했습니다.');
    }
  };

  const handleDelete = async (index) => {
    try {
      const removeQty = Number(quantities[index] || 1);
      const current = ingredients[index];
      const docRef = doc(db, 'ingredients', current.id);
      
      if (removeQty >= current.quantity) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { quantity: current.quantity - removeQty });
      }
      alert('식재료가 삭제되었습니다.');
    } catch (error) {
      console.error('식재료 삭제 실패:', error);
      alert('식재료 삭제에 실패했습니다.');
    }
  };

  const handleModify = async (index) => {
    try {
      const newQty = Number(quantities[index]);
      if (isNaN(newQty) || newQty < 1) {
        alert("올바른 수량을 입력하세요.");
        return;
      }
      await updateQuantity(index, newQty);
      alert("수정되었습니다.");
    } catch (error) {
      console.error('수량 수정 실패:', error);
      alert('수량 수정에 실패했습니다.');
    }
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

        {/* 유통기한 임박 알림 */}
        <div className="alert-section">
          <h3>⚠️ 유통기한 임박 알림</h3>
          {sortedIngredients
            .filter(item => {
              const expiryDate = new Date(item.expiryDate);
              const today = new Date();
              const diffTime = expiryDate - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 3 && diffDays >= 0;
            })
            .map((item, index) => (
              <div key={index} className="alert-card">
                <strong>{item.name}</strong>
                <div>유통기한: {item.expiryDate}</div>
                <div>남은 일수: {Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))}일</div>
              </div>
            ))}
        </div>

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
          <button onClick={() => navigate('/consumed')} className="action-btn">🥕 소비된 식재료 보기</button>
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

        {isLoading ? (
          <p>로딩중...</p>
        ) : sortedIngredients.length === 0 ? (
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
