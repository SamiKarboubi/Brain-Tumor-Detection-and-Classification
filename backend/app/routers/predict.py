from fastapi import APIRouter, UploadFile, File
from app.models.yolo_model import BrainTumorModel
from app.utils.image_utils import encode_image_base64, save_temp_image
from app.schemas.prediction import PredictionResponse

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    content = await file.read()

    # save uploaded image
    temp_path = save_temp_image(content)

    # YOLO prediction
    results = BrainTumorModel.predict(temp_path)

    # Extract class and confidence
    cls_id = int(results.boxes.cls[0])
    tumor_class = results.names[cls_id]
    confidence = float(results.boxes.conf[0])

    # Render bounding boxes on image
    output_image = results.plot()  # returns numpy array (BGR)

    # Encode final image to base64
    encoded = encode_image_base64(output_image)

    return PredictionResponse(
        tumor_class=tumor_class,
        confidence=confidence,
        image=encoded
    )
