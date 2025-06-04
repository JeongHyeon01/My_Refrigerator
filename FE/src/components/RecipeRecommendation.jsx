import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockRecipes = [
  {
    id: 1,
    name: '김치볶음밥',
    ingredients: ['밥', '김치', '계란'],
    score: 92,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: '된장찌개',
    ingredients: ['두부', '된장', '호박'],
    score: 88,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: '오므라이스',
    ingredients: ['밥', '계란', '케찹'],
    score: 79,
    image: 'https://via.placeholder.com/150',
  },
];

const RecipeRecommendation = () => {
  const [recipes] = useState(mockRecipes);
  const navigate = useNavigate();

  return (
    <div className="page-center">
      <div className="form-card">
        <h1 style={{ textAlign: 'center' }}>🍳 나의 냉장고</h1>
        <h2 style={{ textAlign: 'center' }}>🍽️ 레시피 추천 결과</h2>

        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: '#fff',
            }}
          >
            <img src={recipe.image} alt={recipe.name} width="100" height="100" />
            <div>
              <h3>{recipe.name}</h3>
              <p>재료: {recipe.ingredients.join(', ')}</p>
              <p>추천 점수: {recipe.score}점</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate('/main')}
          style={{
            marginTop: '1rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '0.6rem',
            width: '100%',
          }}
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default RecipeRecommendation;
