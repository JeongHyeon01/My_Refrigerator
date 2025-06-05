# app/routers/report_routes.py

from fastapi import APIRouter, Depends
from pymongo.collection import Collection
from datetime import datetime, timedelta
from app.utils.response_utils import success_response, error_response
from app.db import get_ingredients_collection

router = APIRouter()

@router.get("/report/weekly", response_model=dict)
def get_weekly_report(
    ingredients_collection: Collection = Depends(get_ingredients_collection)
):
    try:
        now = datetime.now()
        seven_days_ago = now - timedelta(days=7)
        count_waste = ingredients_collection.count_documents({
            "expiration_date": {"$lte": seven_days_ago},
            "used": False
        })
        total = ingredients_collection.count_documents({})
        waste_rate = (count_waste / total * 100) if total > 0 else 0
        payload = {
            "period": "weekly",
            "total_ingredients": total,
            "wasted_unused": count_waste,
            "waste_rate_percent": round(waste_rate, 2)
        }
        return success_response(payload)
    except Exception as e:
        return error_response(f"주간 리포트 조회 실패: {e}", code=500)

@router.get("/report/monthly", response_model=dict)
def get_monthly_report(
    ingredients_collection: Collection = Depends(get_ingredients_collection)
):
    try:
        now = datetime.now()
        thirty_days_ago = now - timedelta(days=30)
        count_waste = ingredients_collection.count_documents({
            "expiration_date": {"$lte": thirty_days_ago},
            "used": False
        })
        total = ingredients_collection.count_documents({})
        waste_rate = (count_waste / total * 100) if total > 0 else 0
        payload = {
            "period": "monthly",
            "total_ingredients": total,
            "wasted_unused": count_waste,
            "waste_rate_percent": round(waste_rate, 2)
        }
        return success_response(payload)
    except Exception as e:
        return error_response(f"월간 리포트 조회 실패: {e}", code=500)
