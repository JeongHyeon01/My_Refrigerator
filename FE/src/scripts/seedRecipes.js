import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const recipes = [
  {
    name: '김치볶음밥',
    ingredients: ['김치', '밥', '계란', '참기름', '대파'],
    steps: [
      '김치는 적당한 크기로 썰어주세요.',
      '대파는 송송 썰어주세요.',
      '팬에 기름을 두르고 김치를 볶아주세요.',
      '김치가 익으면 밥을 넣고 섞어주세요.',
      '계란을 올리고 참기름을 둘러 마무리해주세요.'
    ],
    tips: '김치는 숙성된 김치를 사용하면 더 맛있어요. 참기름은 마지막에 둘러주세요.'
  },
  {
    name: '계란말이',
    ingredients: ['계란', '대파', '당근', '소금', '식용유'],
    steps: [
      '계란을 그릇에 깨서 풀어주세요.',
      '대파와 당근은 잘게 썰어주세요.',
      '계란물에 소금을 넣고 잘 섞어주세요.',
      '팬에 기름을 두르고 계란물을 얇게 부쳐주세요.',
      '돌돌 말아가며 익혀주세요.'
    ],
    tips: '계란물에 물을 조금 넣으면 더 부드러운 식감을 얻을 수 있어요.'
  },
  {
    name: '된장찌개',
    ingredients: ['된장', '두부', '애호박', '감자', '청양고추', '대파', '양파'],
    steps: [
      '모든 재료를 적당한 크기로 썰어주세요.',
      '냄비에 물을 붓고 된장을 풀어주세요.',
      '감자를 먼저 넣고 끓이다가 나머지 재료를 넣어주세요.',
      '재료가 익으면 마지막에 청양고추와 대파를 넣어주세요.'
    ],
    tips: '된장은 미리 풀어두면 더 맛있어요. 감자는 먼저 넣어 익혀주세요.'
  }
];

const seedRecipes = async () => {
  try {
    const recipesCollection = collection(db, 'recipes');
    
    for (const recipe of recipes) {
      await addDoc(recipesCollection, recipe);
      console.log(`레시피 "${recipe.name}" 추가 완료`);
    }
    
    console.log('모든 레시피 데이터 추가 완료');
  } catch (error) {
    console.error('레시피 데이터 추가 실패:', error);
  }
};

export default seedRecipes; 