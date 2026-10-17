# GuardianPaths 🛡️
### AI-Enhanced Urban Safety and Intelligent Navigation

GuardianPaths is an AI-powered urban safety platform designed to support safer route selection and crowd-density analysis. It combines route-safety assessment, interactive maps, and computer vision to help users understand potential safety concerns in urban environments.

## ✨ Features

- **Safety-Aware Navigation:** Evaluates routes using road-network and safety-related data.
- **Interactive Maps:** Displays route information through a web-based map interface.
- **AI-Based Safety Assessment:** Uses a trained machine-learning model as part of the route-safety workflow.
- **Crowd Density Analysis:** Uses YOLOv8 object detection to detect people in uploaded images and estimate crowd density.
- **Visual Dashboard:** Provides a web interface for route exploration and crowd analysis.
- **Flask Backend:** Exposes API endpoints to connect the frontend with the Python-based processing logic.

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Maps | Leaflet |
| Backend | Python, Flask, Flask-CORS |
| Machine Learning | scikit-learn, Joblib |
| Computer Vision | YOLOv8, Ultralytics, OpenCV |
| Data Processing | Pandas, NumPy |
| Route Analysis | NetworkX |
| Version Control | Git, GitHub, Git LFS |

## 🏗️ Project Architecture

```text
GuardianPaths/
├── backend/
│   ├── app.py
│   ├── model_utils.py
│   ├── route_utils.py
│   ├── locations.py
│   └── models/
├── frontend/
│   ├── index.html
│   ├── crowd.html
│   ├── style.css
│   └── script.js
├── models/
│   └── safety_model.pkl
├── data1/
│   └── Road_Network_Dataset.csv
├── requirements.txt
├── .gitignore
├── .gitattributes
└── README.md
```

*Note: The directory tree is illustrative. Adjust it to match the actual files in your repository.*

## ⚙️ Getting Started

### Prerequisites

- Python 3.10 or a compatible version supported by the project dependencies
- Git
- Git LFS
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/KushagraSrivastava3010/GuardianPaths.git
cd GuardianPaths
git lfs pull
```

### 2. Create a Virtual Environment

On Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

If `requirements.txt` is located in the repository root:

```powershell
pip install -r requirements.txt
```

If it is inside `backend/`, run the installation command using that file's actual path.

### 4. Start the Backend

Navigate to the directory containing `app.py`. For example, if it is inside `backend/`:

```powershell
cd backend
python app.py
```

Keep the backend terminal running. The local API is typically available at:

`http://127.0.0.1:5000`

### 5. Start the Frontend

Open the frontend directory in VS Code and launch `index.html` using the Live Server extension.

If you use a separate crowd-analysis page, open `crowd.html` through the same frontend server.

**Note:** The frontend API configuration must point to the correct backend URL. For a local setup, this is usually `http://127.0.0.1:5000`.

## 🧠 How It Works

### Route Safety Analysis

1. Road-network and related safety data are processed by the backend.
2. The route-analysis logic evaluates available paths.
3. The application uses its configured safety model and route-weighting logic to support route assessment.
4. Route information is returned to the frontend for display.

### Crowd Density Analysis

1. The user uploads a crowd image.
2. YOLOv8 detects people in the image.
3. The backend counts detected people and estimates crowd density using its configured area assumption.
4. The estimated density is classified and returned to the frontend.

Crowd-density results depend on image quality, detection accuracy, and the configured area assumption. They should not be interpreted as a reliable stampede prediction or a substitute for professional emergency monitoring.

## 🔒 Model and Dataset Requirements

GuardianPaths uses a trained safety model and road-network data. Git LFS is configured to manage the large `safety_model.pkl` file.

When cloning the repository, ensure Git LFS is installed and the required model and dataset files are available before starting the backend.

## 🚀 Deployment

The application can be deployed using separate services:

- **Frontend:** GitHub Pages or another static hosting service.
- **Backend:** A Python-compatible hosting service such as Render.

For production deployment, configure the frontend to use the deployed backend URL, configure CORS for the frontend origin, and ensure the model and dataset files are available to the backend.

GitHub Pages alone cannot run the Flask backend or perform YOLO inference.

## 🔮 Future Enhancements

- Real-time traffic and crowd information integration
- Improved route-safety scoring using richer data
- Live camera integration where authorized and appropriate
- Enhanced accessibility and emergency-route support
- Better validation of crowd-density estimates
- Performance monitoring and expanded testing

## 👩‍💻 Author

**Kushagra Srivastava**

GitHub: [@KushagraSrivastava3010](https://github.com/KushagraSrivastava3010)

## ⚠️ Disclaimer

GuardianPaths is a prototype intended to support exploration of urban safety and navigation concepts. Its outputs may be incomplete or inaccurate. Do not rely on this system as the sole basis for emergency decisions or personal-safety judgments.

## 📄 License

No license has been specified yet. Add an appropriate license before granting others permission to reuse or distribute the project.
