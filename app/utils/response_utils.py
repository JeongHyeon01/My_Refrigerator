# app/utils/response_utils.py

from fastapi import HTTPException
from typing import Any

def success_response(data: Any) -> dict:
    return {"status": "success", "data": data}

def error_response(message: str, code: int = 400) -> dict:
    return {"status": "error", "error": message, "code": code}

def raise_http_error(message: str, code: int = 400):
    # FastAPI 기본 HTTPException을 던지고, detail에 JSON 형태 에러 메시지를 담습니다.
    raise HTTPException(status_code=code, detail={"error": message, "code": code})
