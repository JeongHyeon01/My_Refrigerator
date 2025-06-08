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

  const navigateToRecipes = () => {
    navigate('/recipes');
  };

  const navigateToWasteReport = () => {
    navigate('/report');
  };

  const navigateToConsumedIngredients = () => {
    navigate('/consumed');
  };

  const navigateToPreferences = () => {
    navigate('/preferences');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">나의 냉장고</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateToRecipes}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                레시피 추천
              </button>
              <button
                onClick={navigateToWasteReport}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                낭비 리포트
              </button>
              <button
                onClick={navigateToConsumedIngredients}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                소비된 식재료
              </button>
              <button
                onClick={navigateToPreferences}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                레시피 선호도
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 기존 메인 컨텐츠 */}
      <div className="flex justify-center items-start py-10">
        <div className="main-layout flex gap-8 w-full max-w-7xl">
          <div className="main-left bg-white rounded-2xl shadow-lg p-6 mt-0 flex flex-col gap-8 w-80 min-w-[320px]">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">👋 환영합니다!</h2>
            <div className="alert-section bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <h3 className="font-semibold text-yellow-700 mb-2">⚠️ 유통기한 임박 알림</h3>
              {sortedIngredients
                .filter(item => {
                  const expiryDate = new Date(item.expiryDate);
                  const today = new Date();
                  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                  return diffDays <= 3 && diffDays >= 0;
                })
                .map((item, index) => (
                  <div key={index} className="text-sm text-yellow-600">
                    {item.name}: {new Date(item.expiryDate).toLocaleDateString()}까지
                  </div>
                ))}
            </div>
            <form
              className="ingredient-form bg-gray-50 rounded-xl p-4 shadow mb-4 flex flex-col gap-2"
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
              <h3 className="font-semibold mb-2">📝 식재료 등록</h3>
              <input type="text" name="name" placeholder="식재료 이름" />
              <input type="number" name="quantity" placeholder="수량" />
              <input type="date" name="expiryDate" />
              <button type="submit">등록</button>
            </form>
            <div className="main-actions flex flex-col gap-4 mt-4">
              <div className="mb-2 text-gray-700 font-semibold text-lg pl-1">📋 주요 메뉴</div>
              <button className="flex items-center gap-2 bg-green-600 text-white rounded-xl py-3 px-4 shadow hover:bg-green-700 transition text-base font-semibold whitespace-nowrap" onClick={() => navigate('/recipes')}>
                <span className="text-xl">🍽</span> 레시피 추천 보기
              </button>
              <button className="flex items-center gap-2 bg-green-600 text-white rounded-xl py-3 px-4 shadow hover:bg-green-700 transition text-base font-semibold whitespace-nowrap" onClick={() => navigate('/report')}>
                <span className="text-xl">📊</span> 낭비 리포트 보기
              </button>
              <button className="flex items-center gap-2 bg-green-600 text-white rounded-xl py-3 px-4 shadow hover:bg-green-700 transition text-base font-semibold whitespace-nowrap" onClick={() => navigate('/consumed')}>
                <span className="text-xl">🥕</span> 소비된 식재료 보기
              </button>
              <div className="border-t border-gray-200 my-3"></div>
              <button className="flex items-center gap-2 bg-blue-500 text-white rounded-xl py-3 px-4 shadow hover:bg-blue-600 transition text-base font-semibold whitespace-nowrap" onClick={() => navigate('/preferences')}>
                <span className="text-xl">⭐</span> 레시피 선호도 설정
              </button>
              <div className="border-t border-gray-200 my-3"></div>
              <button className="flex items-center gap-2 bg-red-500 text-white rounded-xl py-3 px-4 shadow hover:bg-red-600 transition text-base font-semibold whitespace-nowrap" onClick={handleLogout}>
                <span className="text-xl">🚪</span> 로그아웃
              </button>
            </div>
          </div>
          <div className="main-right bg-white rounded-2xl shadow-lg p-8 mt-0 flex-1 min-w-[400px]">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">📋 등록된 식재료</h3>
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
      </div>
    </div>
  );
};

export default MainPage;
