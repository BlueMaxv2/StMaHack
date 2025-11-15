from typing import Optional

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI()

# Разрешаем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



# Модель данных для POST
class SubmitData(BaseModel):
    action: str
    timestamp: str = None
    message: Optional[str] = None  # ✅ работает в Python 3.9

# ✅ Этот маршрут должен быть POST
@app.post("/api/submit")
def submit(data: SubmitData):
    print("Получено:", data)
    return {"status": "ok", "received": data}

@app.post("/api/click")
def click(data: SubmitData):
    return {"status": "ok", "received": data}


# ОТКРЫТИЕ ПЕРВОЙ СТРАНИЦЫ
frontend_dir = os.path.join(os.path.dirname(__file__), "../frontend")
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
