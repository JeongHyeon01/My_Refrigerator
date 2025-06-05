# app/main.py

from fastapi import FastAPI
import uvicorn

# 라우터 불러오기
from app.routers.ingredient_routes import router as ingredient_router
from app.routers.alert_routes import router as alert_router
from app.routers.report_routes import router as report_router
from app.routers.seed_routes import router as seed_router

app = FastAPI(title="냉장고 관리 백엔드 B")

# 각 기능별 라우터 등록
app.include_router(ingredient_router, prefix="/ingredient", tags=["ingredient"])
app.include_router(alert_router, prefix="", tags=["alert"])
app.include_router(report_router, prefix="", tags=["report"])
app.include_router(seed_router, prefix="", tags=["seed"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
