from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/recommend")
def recommend(keyword: str = Query(..., description="추천할 재료 키워드")):
    # 여기에 크롤링 또는 추천 로직을 구현하세요.
    # 예시: 임시 더미 데이터 반환
    return [
        {
            "name": f"{keyword}로 만든 레시피",
            "mainImageUrl": "https://example.com/image.jpg",
            "ingredients": [keyword, "재료2", "재료3"],
            "steps": [
                {"imageUrl": "https://example.com/step1.jpg", "description": "1단계 설명"},
                {"imageUrl": "https://example.com/step2.jpg", "description": "2단계 설명"}
            ]
        }
    ] 