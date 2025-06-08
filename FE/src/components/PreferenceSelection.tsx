import React, { useState, useEffect } from 'react';
import { UserPreferences, RecipeType, FlavorAndTexture, CookingStyle, DietaryPreference, OtherPreferences } from '../types/preference';

const LOCAL_KEY = 'userRecipePreferences';

const PreferenceSelection: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
    return {
      recipeType: {
        cuisine: [] as string[],
        cookingMethod: [] as string[],
        purpose: [] as string[]
      },
      flavorAndTexture: {
        taste: [] as string[],
        texture: [] as string[]
      },
      cookingStyle: {
        convenience: [] as string[],
        time: [] as string[],
        preparation: [] as string[]
      },
      dietaryPreference: {
        health: [] as string[],
        restrictions: [] as string[],
        lifestyle: [] as string[]
      },
      otherPreferences: {
        difficulty: '중간',
        ingredientLimit: '상관없음',
        includeMedia: true
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const handleMultiSelect = (
    category: keyof UserPreferences,
    subCategory: string,
    value: string,
    checked: boolean
  ) => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      const targetArray = newPrefs[category][subCategory as keyof typeof newPrefs[typeof category]];
      
      if (Array.isArray(targetArray)) {
        if (checked) {
          (targetArray as string[]).push(value);
        } else {
          const index = (targetArray as string[]).indexOf(value);
          if (index > -1) {
            (targetArray as string[]).splice(index, 1);
          }
        }
      }
      
      return newPrefs;
    });
  };

  const handleSingleSelect = (
    category: keyof UserPreferences,
    subCategory: string,
    value: string
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: value
      }
    }));
  };

  const handleCheckbox = (
    category: keyof UserPreferences,
    subCategory: string,
    checked: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: checked
      }
    }));
  };

  const renderMultiSelect = (
    title: string,
    category: keyof UserPreferences,
    subCategory: string,
    options: string[]
  ) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <label key={option} className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={(preferences[category][subCategory as keyof typeof preferences[typeof category]] as string[]).includes(option)}
              onChange={(e) => handleMultiSelect(category, subCategory, option, e.target.checked)}
            />
            <span className="ml-2">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderSingleSelect = (
    title: string,
    category: keyof UserPreferences,
    subCategory: string,
    options: string[]
  ) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <label key={option} className="inline-flex items-center">
            <input
              type="radio"
              name={subCategory}
              className="form-radio h-5 w-5 text-blue-600"
              checked={preferences[category][subCategory as keyof typeof preferences[typeof category]] === option}
              onChange={() => handleSingleSelect(category, subCategory, option)}
            />
            <span className="ml-2">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-8 text-blue-700 text-center">레시피 선호도 설정</h2>
      <form className="space-y-10">
        <section className="bg-gray-50 rounded-xl p-6 mb-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🍽️ 요리 종류</h3>
          {renderMultiSelect('음식 종류', 'recipeType', 'cuisine', ['한식', '중식', '일식', '양식', '동남아식'])}
          {renderMultiSelect('조리 방법', 'recipeType', 'cookingMethod', ['국', '찌개', '볶음', '튀김', '구이', '조림', '비빔', '무침', '샐러드', '디저트', '음료'])}
          {renderMultiSelect('목적', 'recipeType', 'purpose', ['도시락용', '손님접대', '혼밥', '아이반찬', '캠핑요리', '다이어트식'])}
        </section>
        <section className="bg-gray-50 rounded-xl p-6 mb-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🌶️ 맛/식감 취향</h3>
          {renderMultiSelect('맛', 'flavorAndTexture', 'taste', ['매운맛', '단맛', '짠맛', '담백한 맛', '새콤한 맛', '고소한 맛'])}
          {renderMultiSelect('식감', 'flavorAndTexture', 'texture', ['바삭바삭', '촉촉한', '쫄깃한', '부드러운', '탱글탱글한'])}
        </section>
        <section className="bg-gray-50 rounded-xl p-6 mb-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🕒 조리 방식 / 시간</h3>
          {renderMultiSelect('편의성', 'cookingStyle', 'convenience', ['간편 요리', '전자레인지', '한냄비 요리'])}
          {renderMultiSelect('조리 시간', 'cookingStyle', 'time', ['10분 이내', '30분 이내', '여유로운 요리'])}
          {renderMultiSelect('준비 방식', 'cookingStyle', 'preparation', ['설거지 적은 요리', '밀프렙'])}
        </section>
        <section className="bg-gray-50 rounded-xl p-6 mb-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🧘‍♀️ 식이 목적 / 생활 패턴</h3>
          {renderMultiSelect('건강 목적', 'dietaryPreference', 'health', ['다이어트', '저탄고지', '고단백', '고탄수', '당뇨식'])}
          {renderMultiSelect('식이 제한', 'dietaryPreference', 'restrictions', ['비건', '락토프리', '글루텐프리', '키토'])}
          {renderMultiSelect('생활 패턴', 'dietaryPreference', 'lifestyle', ['아이 이유식', '고연령 부드러운 식사', '혼밥 최적화'])}
        </section>
        <section className="bg-gray-50 rounded-xl p-6 mb-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">💬 기타</h3>
          {renderSingleSelect('요리 난이도', 'otherPreferences', 'difficulty', ['쉬움', '중간', '어려움'])}
          {renderSingleSelect('재료 수 제한', 'otherPreferences', 'ingredientLimit', ['5개 이하', '10개 이하', '상관없음'])}
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={preferences.otherPreferences.includeMedia}
                onChange={(e) => handleCheckbox('otherPreferences', 'includeMedia', e.target.checked)}
              />
              <span className="ml-2">시각 자료가 포함된 레시피만 보기</span>
            </label>
          </div>
        </section>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            선호도 저장하기
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-8 py-3 rounded-lg shadow hover:bg-gray-500 transition"
            onClick={() => window.location.href = '/main'}
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferenceSelection; 