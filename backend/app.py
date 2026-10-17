from flask import Flask, request, jsonify
from flask_cors import CORS

from model_utils import predict_safety
from route_utils import get_safest_route
from locations import LOCATIONS   # ✅ PART 2: import locations

# ✅ ADD (for crowd detection)
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# ✅ LOAD YOLO MODEL (UPDATED → lighter + more stable)
crowd_model = YOLO("yolov8n.pt")


# ---------------------------
# Health Check Route
# ---------------------------
@app.route("/", methods=["GET"])
def home():
    return "Safe Route Finder Backend is running"


# ---------------------------
# Safety Score Prediction
# ---------------------------
@app.route("/predict_safety", methods=["POST"])
def predict():
    data = request.json

    safety_score = predict_safety({
        "crowd_density": data.get("crowd_density", 0),
        "crime_rate": data.get("crime_rate", 0),
        "lighting": data.get("lighting", 0),
        "feedback_score": data.get("feedback_score", 0)
    })

    return jsonify({
        "safety_score": round(safety_score, 3)
    })


# ---------------------------
# Safest Route Finder
# ---------------------------
@app.route("/get_route", methods=["POST"])
def get_route():
    data = request.json

    start = data.get("start")
    end = data.get("end")

    if start is None or end is None:
        return jsonify({"error": "Start or end location missing"}), 400

    path, risk = get_safest_route(start, end)

    if path is None:
        return jsonify({"error": "No route found"}), 404

    id_to_location = {loc["id"]: loc for loc in LOCATIONS}

    route_names = [
        id_to_location[n]["name"]
        for n in path if n in id_to_location
    ]

    route_coords = [
        [id_to_location[n]["lat"], id_to_location[n]["lon"]]
        for n in path if n in id_to_location
    ]

    return jsonify({
        "route": path,
        "route_names": route_names,
        "route_coords": route_coords,
        "total_risk": round(risk, 3)
    })


# ---------------------------
# Locations API (For Dropdowns)
# ---------------------------
@app.route("/locations", methods=["GET"])
def get_locations():
    return jsonify([
        {"id": loc["id"], "name": loc["name"]}
        for loc in LOCATIONS
    ])


# ---------------------------
# ✅ CROWD DENSITY ANALYSIS (FIXED)
# ---------------------------
@app.route("/predict_crowd", methods=["POST"])
def predict_crowd():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    # Read image
    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # ✅ Better detection settings
    results = crowd_model(image, conf=0.2)

    person_count = 0

    # ✅ Correct detection logic
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            if cls_id == 0:  # person class
                person_count += 1

    print("Detected people:", person_count)  # debug

    # Fixed area assumption
    area = 5
    density = person_count / area

    # Risk classification (UNCHANGED LOGIC)
    if density <= 2:
        level = "safe"
        message = "Area is safe with normal crowd levels."
    elif density <= 4:
        level = "moderately"
        message = "Crowd is increasing, stay alert."
    else:
        level = "high"
        message = "Stampede risk! Avoid this area."

    return jsonify({
        "count": int(person_count),   # ✅ FIXED KEY
        "density": round(density, 2),
        "level": level,
        "message": message
    })


# ---------------------------
# Run Server
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)