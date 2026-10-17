import joblib
import numpy as np

# Load model once
import os
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "safety_model.pkl")

model = joblib.load(MODEL_PATH)


def predict_safety(features: dict):
    """
    features = {
        'crowd_density': float,
        'crime_rate': float,
        'lighting': float,
        'feedback_score': float
    }
    """
    input_array = np.array([[
        features["crowd_density"],
        features["crime_rate"],
        features["lighting"],
        features["feedback_score"]
    ]])

    safety_score = model.predict(input_array)[0]
    return float(safety_score)
