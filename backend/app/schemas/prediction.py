from pydantic import BaseModel

class PredictionResponse(BaseModel):
    tumor_class: str
    confidence: float
    image: str  # base64 image
