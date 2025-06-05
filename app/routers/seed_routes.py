# app/routers/seed_routes.py

from fastapi import APIRouter, Depends
from pymongo.collection import Collection
from datetime import datetime, timedelta
from app.utils.response_utils import success_response, error_response
from app.db import get_ingredients_collection
import random
import uuid

router = APIRouter()

@router.post("/seed/", response_model=dict)
def seed_test_data(
    ingredients_collection: Collection = Depends(get_ingredients_collection),
    count: int = 10   # ?count=숫자 로 원하는 개수 설정 가능
):
    try:
        docs = []
        now = datetime.now()
        for _ in range(count):
            # 유통기한: 현재 기준 -15일 ~ +15일 사이 랜덤
            delta_days = random.randint(-15, 15)
            exp_date = now + timedelta(days=delta_days)
            used_flag = random.choice([True, False])

            doc = {
                "_id": str(uuid.uuid4()),
                "name": f"샘플재료_{random.randint(1,1000)}",
                "quantity": random.randint(1, 10),
                "expiration_date": exp_date,
                "used": used_flag,
                # 생성 직후엔 alert/expired=False
                "alert": False,
                "expired": False,
                "created_at": now
            }
            docs.append(doc)

        result = ingredients_collection.insert_many(docs)
        return success_response({"inserted_ids": result.inserted_ids})
    except Exception as e:
        return error_response(f"샘플 데이터 생성 실패: {e}", code=500)
