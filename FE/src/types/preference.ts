export type RecipeType = {
  cuisine: ('한식' | '중식' | '일식' | '양식' | '동남아식')[];
  cookingMethod: ('국' | '찌개' | '볶음' | '튀김' | '구이' | '조림' | '비빔' | '무침' | '샐러드' | '디저트' | '음료')[];
  purpose: ('도시락용' | '손님접대' | '혼밥' | '아이반찬' | '캠핑요리' | '다이어트식')[];
};

export type FlavorAndTexture = {
  taste: ('매운맛' | '단맛' | '짠맛' | '담백한 맛' | '새콤한 맛' | '고소한 맛')[];
  texture: ('바삭바삭' | '촉촉한' | '쫄깃한' | '부드러운' | '탱글탱글한')[];
};

export type CookingStyle = {
  convenience: ('간편 요리' | '전자레인지' | '한냄비 요리')[];
  time: ('10분 이내' | '30분 이내' | '여유로운 요리')[];
  preparation: ('설거지 적은 요리' | '밀프렙')[];
};

export type DietaryPreference = {
  health: ('다이어트' | '저탄고지' | '고단백' | '고탄수' | '당뇨식')[];
  restrictions: ('비건' | '락토프리' | '글루텐프리' | '키토')[];
  lifestyle: ('아이 이유식' | '고연령 부드러운 식사' | '혼밥 최적화')[];
};

export type OtherPreferences = {
  difficulty: '쉬움' | '중간' | '어려움';
  ingredientLimit: '5개 이하' | '10개 이하' | '상관없음';
  includeMedia: boolean;
};

export type UserPreferences = {
  recipeType: RecipeType;
  flavorAndTexture: FlavorAndTexture;
  cookingStyle: CookingStyle;
  dietaryPreference: DietaryPreference;
  otherPreferences: OtherPreferences;
}; 