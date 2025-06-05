# app/routers/alert_routes.py

from fastapi import APIRouter, Depends
from pymongo.collection import Collection
from datetime import datetime, timedelta
from app.utils.response_utils import success_response, error_response
from app.utils.alert_utils import is_expiring_soon
from app.db import get_ingredients_collection

router = APIRouter()

@router.get("/alert/", response_model=dict)
def get_alert_list(
    ingredients_collection: Collection = Depends(get_ingredients_collection)
):
    try:
        docs = list(ingredients_collection.find({"alert": True, "used": False}, {"_id": 0}))
        return success_response({"alerts": docs})
    except Exception as e:
        return error_response(f"알림 조회 실패: {e}", code=500)

@router.get("/alert/expired", response_model=dict)
def get_expired_list(
    ingredients_collection: Collection = Depends(get_ingredients_collection)
):
    try:
        docs = list(ingredients_collection.find({"expired": True, "used": False}, {"_id": 0}))
        return success_response({"expired": docs})
    except Exception as e:
        return error_response(f"만료 조회 실패: {e}", code=500)

@router.post("/alert/update", response_model=dict)
def update_alert_flags(
    ingredients_collection: Collection = Depends(get_ingredients_collection)
):
    try:
        now = datetime.now()

        # 1) 이미 만료된 문서(expiration_date <= now & used=False)들은 expired=True, alert=False
        ingredients_collection.update_many(
            {"expiration_date": {"$lte": now}, "used": False},
            {"$set": {"expired": True, "alert": False}}
        )

        # 2) 곧 만료될 항목 (지금부터 3일 이내 & used=False): alert=True, expired=False
        three_days_later = now + timedelta(days=3)
        ingredients_collection.update_many(
            {
                "expiration_date": {"$gt": now, "$lte": three_days_later},
                "used": False
            },
            {"$set": {"alert": True, "expired": False}}
        )

        # 3) 그 외 (만료 3일 후 & used=False): alert=False, expired=False
        ingredients_collection.update_many(
            {
                "expiration_date": {"$gt": three_days_later},
                "used": False
            },
            {"$set": {"alert": False, "expired": False}}
        )

        return success_response({"message": "알림 플래그 업데이트 완료"})
    except Exception as e:
        return error_response(f"알림 플래그 갱신 실패: {e}", code=500)
