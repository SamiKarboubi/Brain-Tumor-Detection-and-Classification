from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.predict import router as predict_router

app = FastAPI(title="Brain Tumor Detection API")

# CORS for frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change with domain when deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")
