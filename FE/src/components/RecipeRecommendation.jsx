import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import axios from 'axios';
import './RecipeRecommendation.css';

const RecipeRecommendation = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    fetchUserIngredients();
    fetchSavedRecipes();
  }, []);

  const fetchUserIngredients = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('로그인이 필요합니다.');
        return;
      }

      const q = query(collection(db, 'ingredients'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const ingredients = querySnapshot.docs.map(doc => doc.data().name);
      setUserIngredients(ingredients);

      // 사용자의 재료로 레시피 검색
      if (ingredients.length > 0) {
        await fetchRecipes(ingredients[0]); // 첫 번째 재료로 검색
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

      // 크롤링된 레시피를 Firebase에 저장하고, 저장된 문서의 id를 함께 저장
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

  if (isLoading) {
    return (
      <div className="recommend-layout">
        <div className="recommend-card">
          <p>레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommend-layout">
        <div className="recommend-card">
          <p className="recommend-error">{error}</p>
          <button onClick={() => navigate('/main')} className="recommend-btn">메인 페이지로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommend-layout">
      <div className="recommend-card">
        <h2 className="recommend-title">🍳 나의 냉장고 - 추천 레시피</h2>
        <p className="recommend-desc">
          현재 냉장고의 재료: {userIngredients.join(', ')}
        </p>

        {recipes.length === 0 ? (
          <p>현재 냉장고의 재료로 만들 수 있는 레시피가 없습니다.</p>
        ) : (
          <ul className="recommend-list">
            {recipes.map((recipe, index) => (
              <li key={index} className="recommend-item">
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="recommend-link"
                >
                  <div className="recommend-recipename">📖 {recipe.name}</div>
                  <div className="recommend-ingredients">
                    필요 재료: {recipe.ingredients?.join(', ')}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => navigate('/main')}
          className="recommend-btn"
        >
          🔙 메인 페이지로
        </button>
      </div>
    </div>
  );
};

export default RecipeRecommendation;
