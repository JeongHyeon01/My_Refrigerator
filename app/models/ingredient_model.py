# app/models/ingredient_model.py

from pydantic import BaseModel
from datetime import datetime

class IngredientIn(BaseModel):
    name: str
    quantity: int
    expiration_date: datetime

class IngredientUse(BaseModel):
    used: bool
