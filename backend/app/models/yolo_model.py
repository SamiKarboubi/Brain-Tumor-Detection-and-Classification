from ultralytics import YOLO

class BrainTumorModel:
    _model = None

    @classmethod
    def load_model(cls):
        if cls._model is None:
            cls._model = YOLO("saved_model/best.pt")
        return cls._model

    @classmethod
    def predict(cls, img_path):
        model = cls.load_model()
        results = model(img_path)[0]
        return results
