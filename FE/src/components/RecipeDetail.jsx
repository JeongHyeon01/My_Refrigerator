import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setIsLoading(true);
      const recipeDoc = await getDoc(doc(db, 'recipes', id));
      
      if (!recipeDoc.exists()) {
        setError('레시피를 찾을 수 없습니다.');
        return;
      }

      setRecipe({ id: recipeDoc.id, ...recipeDoc.data() });
    } catch (error) {
      console.error('레시피 조회 실패:', error);
      setError('레시피를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="detail-layout">
        <div className="detail-card">
          <p>레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="detail-layout">
        <div className="detail-card">
          <h2 className="detail-error">❌ {error || '레시피를 찾을 수 없습니다.'}</h2>
          <button onClick={() => navigate('/recipes')} className="detail-btn">
            🔙 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-layout">
      <div className="detail-card">
        <h2 className="detail-title">{recipe.name}</h2>

        <h4>🧂 재료</h4>
        <ul className="detail-list">
          {recipe.ingredients?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h4>👨‍🍳 조리 순서</h4>
        <ol className="detail-list">
          {recipe.steps?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        {recipe.tips && (
          <>
            <h4>💡 요리 팁</h4>
            <p className="detail-tips">{recipe.tips}</p>
          </>
        )}

        <button onClick={() => navigate('/recipes')} className="detail-btn">
          🔙 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
