import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const recipeData = {
  'kimchi-fried-rice': {
    name: '김치볶음밥',
    ingredients: ['김치', '밥', '계란', '참기름'],
    steps: ['팬에 기름을 두르고 김치를 볶는다', '밥을 넣고 섞는다', '계란을 올리고 마무리한다']
  },
  'egg-roll': {
    name: '계란말이',
    ingredients: ['계란', '파', '당근'],
    steps: ['계란을 풀고 야채를 넣는다', '팬에 얇게 부친다', '돌돌 말아가며 익힌다']
  },
  'doenjang-soup': {
    name: '된장찌개',
    ingredients: ['된장', '두부', '호박', '감자', '고추'],
    steps: ['재료를 썰고 물에 넣는다', '된장을 풀고 끓인다', '재료가 익으면 마무리']
  }
};

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipeData[id];

  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>❌ 레시피를 찾을 수 없습니다.</h2>
        <button onClick={() => navigate('/recipes')} style={buttonStyle}>
          🔙 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{recipe.name}</h2>

        <h4>🧂 재료</h4>
        <ul style={listStyle}>
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h4>👨‍🍳 조리 순서</h4>
        <ol style={listStyle}>
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <button onClick={() => navigate('/recipes')} style={buttonStyle}>
          🔙 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;

// 스타일 정의
const pageStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  padding: '2rem'
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '600px'
};

const listStyle = {
  paddingLeft: '1.2rem',
  marginBottom: '1rem'
};

const buttonStyle = {
  marginTop: '1.5rem',
  padding: '0.8rem 1.2rem',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};
