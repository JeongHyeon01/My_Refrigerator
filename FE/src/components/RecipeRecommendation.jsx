import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RecipeRecommendation = () => {
  const navigate = useNavigate();

  const recipes = [
    { id: 'kimchi-fried-rice', name: '김치볶음밥' },
    { id: 'egg-roll', name: '계란말이' },
    { id: 'doenjang-soup', name: '된장찌개' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}
      >
        <h2>🍳 나의 냉장고 - 추천 레시피</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recipes.map((r) => (
            <li key={r.id} style={{ margin: '1rem 0' }}>
              <Link
                to={`/recipes/${r.id}`}
                style={{
                  display: 'block',
                  padding: '1rem',
                  backgroundColor: '#f1f1f1',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: 'bold'
                }}
              >
                📖 {r.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate('/main')}
          style={{
            marginTop: '1rem',
            padding: '0.8rem 1.2rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔙 메인 페이지로
        </button>
      </div>
    </div>
  );
};

export default RecipeRecommendation;
