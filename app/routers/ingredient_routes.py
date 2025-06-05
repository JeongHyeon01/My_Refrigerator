# app/routers/ingredient_routes.py

from fastapi import APIRouter, HTTPException, Depends
from pymongo.collection import Collection
from app.models.ingredient_model import IngredientIn, IngredientUse
from app.utils.response_utils import success_response, error_response
from app.db import get_ingredients_collection
from datetime import datetime

from bson import ObjectId


router = APIRouter()

@router.post("/", response_model=dict)
def create_ingredient(
    payload: IngredientIn,
    ingredients_collection: Collection = Depends(get_ingredients_collection)
):
    try:
        now = datetime.now()
        doc = {
            "name": payload.name,
            "quantity": payload.quantity,
            "expiration_date": payload.expiration_date,
            "used": False,
            "alert": False,
            "expired": False,
            "created_at": now
        }
        result = ingredients_collection.insert_one(doc)
        return success_response({"inserted_id": str(result.inserted_id)})
    except Exception as e:
        return error_response(f"식재료 추가 실패: {e}", code=500)

@router.patch("/{ingredient_id}/use", response_model=dict)
def mark_used(
    ingredient_id: str,
    payload: IngredientUse,
    ingredients_collection: Collection = Depends(get_ingredients_collection)
):
    try:
        oid = ObjectId(ingredient_id)       # ingredient_id(문자열) → ObjectId로 변환하여 사용
        result = ingredients_collection.update_one(
            {"_id": oid},  
            {"$set": {"used": payload.used}}
        )
        if result.matched_count == 0:
            return error_response("해당 ID의 식재료가 없습니다.", code=404)
        return success_response({"modified_count": result.modified_count})
    except Exception as e:
        return error_response(f"식재료 사용 상태 변경 실패: {e}", code=500)
