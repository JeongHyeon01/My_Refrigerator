import React from 'react';
import { Link } from 'react-router-dom';

const RecipeRecommendation = () => {
  const recipes = [
    { id: 'kimchi-fried-rice', name: '김치볶음밥' },
    { id: 'egg-roll', name: '계란말이' },
    { id: 'doenjang-soup', name: '된장찌개' }
  ];

  return (
    <div className="page-center">
      <div className="form-card" style={{ maxWidth: '600px' }}>
        <h2>🍽 추천 레시피</h2>
        <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={{ margin: '1rem 0' }}>
              <Link to={`/recipes/${recipe.id}`} style={{ fontSize: '1.2rem', color: '#333' }}>
                📖 {recipe.name}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={() => window.history.back()} className="action-btn" style={{ marginTop: '1rem' }}>
          🔙 메인 페이지로
        </button>
      </div>
    </div>
  );
};

export default RecipeRecommendation;
