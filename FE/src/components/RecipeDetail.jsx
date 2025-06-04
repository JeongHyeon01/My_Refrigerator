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
    return <p>해당 레시피를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="page-center">
      <div className="form-card" style={{ maxWidth: '600px', textAlign: 'left' }}>
        <h2>{recipe.name}</h2>
        <h4>🧂 재료</h4>
        <ul>{recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
        <h4>👨‍🍳 조리 순서</h4>
        <ol>{recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}</ol>

        <button onClick={() => navigate('/recipes')} className="action-btn" style={{ marginTop: '1rem' }}>
          🔙 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
