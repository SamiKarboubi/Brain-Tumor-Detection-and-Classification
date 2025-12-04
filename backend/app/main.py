from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.predict import router as predict_router
import os

app = FastAPI(title="Brain Tumor Detection API")
port = int(os.environ.get("PORT", 8000))

# CORS for frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change with domain when deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
