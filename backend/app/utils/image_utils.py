import base64
import cv2
import numpy as np

def encode_image_base64(img):
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode("utf-8")

def save_temp_image(content):
    temp_path = "temp.jpg"
    with open(temp_path, "wb") as f:
        f.write(content)
    return temp_path
