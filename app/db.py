# app/db.py

from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일에 저장된 MONGODB_URI 등을 불러오기

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "fridge_db")

# 전역 MongoClient 인스턴스
db_client = MongoClient(MONGODB_URI)
db = db_client[DATABASE_NAME]

# 필요 시 helper 함수로 컬렉션을 반환할 수도 있습니다.
def get_ingredients_collection():
    return db["ingredients_collection"]
