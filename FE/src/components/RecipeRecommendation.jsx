import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import axios from 'axios';
import './RecipeRecommendation.css';

// 샘플 IDF 값 (실제 서비스에서는 서버에서 받아오거나 DB에 저장 필요)
const ingredientIdf = {
  '된장': 2.0, '소금': 0.2, '설탕': 0.2, '표고버섯': 1.8, '카레가루': 1.7, '감자': 0.5, '버터': 0.7
};
// 샘플 유사재료 dict
const similarIngredients = {
  '버터': [{ name: '마가린', weight: 0.7 }, { name: '올리브오일', weight: 0.5 }],
  '쇠고기': [{ name: '돼지고기', weight: 0.6 }]
};
// 샘플 사용자 취향
const userPreferences = {
  spicy: true,
  dessert: false,
  likedTypes: ['볶음', '국'],
};

const PAGE_SIZE_OPTIONS = [5, 10, 20];

function normalizeIngredientName(name) {
  return name
    .replace(/[0-9]+(개|ml|g|L|약간)?/g, '') // 숫자+단위+약간 제거
    .replace(/구매/g, '') // '구매' 제거
    .replace(/\s+/g, '') // 공백 제거
    .trim();
}

function calcRecipeScoreDetail(recipe, userIngredients, userExpiringIngredients = []) {
  // 정규화된 이름으로 비교
  const normalizedUserIngredients = userIngredients.map(normalizeIngredientName);
  const normalizedRecipeIngredients = recipe.ingredients.map(normalizeIngredientName);

  // 1. TF-IDF 기반 재료 중요도
  let tfidfSum = 0;
  let matchedIngredients = [];
  let substituteIngredients = [];
  normalizedRecipeIngredients.forEach((ing, idx) => {
    if (normalizedUserIngredients.includes(ing)) {
      tfidfSum += (1 * (ingredientIdf[ing] || 0));
      matchedIngredients.push(ing);
    } else if (similarIngredients[ing]) {
      for (const sim of similarIngredients[ing]) {
        if (normalizedUserIngredients.includes(normalizeIngredientName(sim.name))) {
          tfidfSum += (1 * (ingredientIdf[ing] || 0)) * sim.weight;
          substituteIngredients.push({ origin: ing, substitute: sim.name, weight: sim.weight });
          break;
        }
      }
    }
  });

  // 2. 레시피 가치 점수 + 사용자 맞춤도
  let valueScore = 0;
  if (recipe.rating >= 4.5) valueScore += 10;
  if ((normalizedRecipeIngredients.length || 0) <= 5) valueScore += 5;
  if (recipe.hasVideo || recipe.hasImage) valueScore += 5;
  if (userExpiringIngredients.length > 0 && normalizedRecipeIngredients.some(ing => userExpiringIngredients.includes(ing))) {
    valueScore += 5;
  }

  // 3. 활용률/소진률
  const owned = matchedIngredients.length;
  const 활용률 = normalizedUserIngredients.length ? owned / normalizedUserIngredients.length : 0;
  const 소진률 = normalizedRecipeIngredients.length ? owned / normalizedRecipeIngredients.length : 0;
  const 활용소진Score = (소진률 * 0.7 + 활용률 * 0.3) * 70;

  // 총점
  const total = Math.round(활용소진Score + valueScore);

  return {
    total,
    tfidfSum: Math.round(tfidfSum * 10) / 10, // 소수점 1자리
    valueScore,
    활용률: Math.round(활용률 * 100),
    소진률: Math.round(소진률 * 100),
    활용소진Score: Math.round(활용소진Score),
    substituteIngredients,
    matchedIngredients,
  };
}

const RecipeRecommendation = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userIngredients, setUserIngredients] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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
      fetchUserIngredients(userId);
      fetchSavedRecipes();
    }
  }, [authChecked, userId]);

  const fetchUserIngredients = async (uid) => {
    try {
      const q = query(collection(db, 'ingredients'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const ingredients = querySnapshot.docs.map(doc => doc.data().name);
      setUserIngredients(ingredients);
      if (ingredients.length > 0) {
        await fetchRecipes(ingredients[0]);
      }
    } catch (error) {
      console.error('재료 조회 실패:', error);
      setError('재료 조회에 실패했습니다.');
    }
  };

  const fetchRecipes = async (ingredient) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/recipes/crawl?ingredient=${ingredient}`);
      const crawledRecipes = response.data;
      const recipesCollection = collection(db, 'recipes');
      const savedRecipes = [];
      for (const recipe of crawledRecipes) {
        const docRef = await addDoc(recipesCollection, {
          name: recipe.name,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          url: recipe.url,
          createdAt: new Date()
        });
        savedRecipes.push({
          id: docRef.id,
          name: recipe.name,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          url: recipe.url
        });
      }
      setRecipes(savedRecipes);
    } catch (error) {
      console.error('레시피 크롤링 실패:', error);
      setError('레시피를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      setIsLoading(true);
      const recipesCollection = collection(db, 'recipes');
      const querySnapshot = await getDocs(recipesCollection);
      const savedRecipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(savedRecipes);
    } catch (error) {
      console.error('레시피 목록 조회 실패:', error);
      setError('레시피 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 점수 계산 및 정렬된 레시피 리스트
  const scoredRecipes = recipes.map(recipe => {
    const userExpiringIngredients = [];
    const scoreDetail = calcRecipeScoreDetail(recipe, userIngredients, userExpiringIngredients);
    return { ...recipe, scoreDetail };
  });
  const sortedRecipes = [...scoredRecipes].sort((a, b) => {
    if (sortOrder === 'desc') return b.scoreDetail.total - a.scoreDetail.total;
    else return a.scoreDetail.total - b.scoreDetail.total;
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedRecipes.length / pageSize);
  const pagedRecipes = sortedRecipes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // 페이지 사이즈 변경 시 1페이지로 이동
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 정렬 변경 시 1페이지로 이동
  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  // 페이지네이션 번호 생성 (중간 생략 ...)
  function getPaginationNumbers(current, total) {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return pages;
  }

  if (!authChecked) {
    return (
      <div className="recommend-layout">
        <div className="recommend-card">
          <p>인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommend-layout">
        <div className="recommend-card">
          <p className="recommend-error">{error}</p>
          <button onClick={() => navigate('/login')} className="recommend-btn">로그인 페이지로</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="recommend-layout">
        <div className="recommend-card">
          <p>레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommend-layout bg-gray-100 min-h-screen py-8">
      <div className="recommend-card max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="recommend-title text-3xl font-bold mb-8 text-blue-700 text-center">🍳 나의 냉장고 - 추천 레시피</h2>
        <p className="recommend-desc text-center mb-6 text-gray-700">
          현재 냉장고의 재료: {userIngredients.join(', ')}
        </p>
        <div className="flex flex-wrap gap-6 items-center justify-between mb-8">
          <div>
            <b>정렬:</b>
            <button onClick={() => handleSortOrderChange('desc')} className={`ml-2 px-3 py-1 rounded ${sortOrder==='desc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}>점수 높은 순</button>
            <button onClick={() => handleSortOrderChange('asc')} className={`ml-2 px-3 py-1 rounded ${sortOrder==='asc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}>점수 낮은 순</button>
          </div>
          <div>
            <b>페이지당 레시피 수:</b>
            {PAGE_SIZE_OPTIONS.map(size => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                className={`ml-2 px-3 py-1 rounded ${pageSize===size ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
              >
                {size}개
              </button>
            ))}
          </div>
        </div>
        {pagedRecipes.length === 0 ? (
          <p className="text-center text-gray-500">현재 냉장고의 재료로 만들 수 있는 레시피가 없습니다.</p>
        ) : (
          <>
            <ul className="recommend-list grid grid-cols-1 md:grid-cols-2 gap-8">
              {pagedRecipes.map((recipe, index) => {
                const scoreDetail = recipe.scoreDetail;
                return (
                  <li key={recipe.id || index} className="recommend-item bg-gray-50 rounded-xl shadow p-6 flex flex-col gap-2">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="recommend-link text-lg font-semibold text-blue-700 hover:underline mb-2"
                    >
                      📖 {recipe.name}
                    </Link>
                    <div className="recommend-ingredients text-gray-700 mb-1">
                      필요 재료: {recipe.ingredients?.join(', ')}
                    </div>
                    <div className="recommend-score text-sm text-gray-800">
                      <b className="text-orange-600">🔥 총 추천 점수: {scoreDetail.total}점</b>
                      <ul className="mt-1 ml-2 text-gray-600">
                        <li>TF-IDF 재료 중요도 합: {scoreDetail.tfidfSum}</li>
                        <li>활용률: {scoreDetail.활용률}% / 소진률: {scoreDetail.소진률}%</li>
                        <li>활용률+소진률 가중점수: {scoreDetail.활용소진Score}점</li>
                        <li>레시피 가치/보너스: {scoreDetail.valueScore}점</li>
                        {scoreDetail.substituteIngredients.length > 0 && (
                          <li>
                            대체재 사용: {scoreDetail.substituteIngredients.map(s => `${s.origin}→${s.substitute}(${Math.round(s.weight*100)}%)`).join(', ')}
                          </li>
                        )}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-center items-center gap-2 mt-8">
              <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50">이전</button>
              {getPaginationNumbers(currentPage, totalPages).map((page, idx) => (
                typeof page === 'number' ? (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${currentPage===page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} className="px-2 text-gray-400">...</span>
                )
              ))}
              <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50">다음</button>
            </div>
          </>
        )}
        <button
          onClick={() => navigate('/main')}
          className="recommend-btn mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          🔙 메인 페이지로
        </button>
      </div>
    </div>
  );
};

export default RecipeRecommendation;
