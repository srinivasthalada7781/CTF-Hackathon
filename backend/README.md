# S³ (Secure Smart Scanner) AI-Powered Malware Detection

S³ is an end-to-end, production-ready AI malware detection system. It features real PE (Portable Executable) file extraction, an XGBoost model trained on real malware features, and explainable AI insights using SHAP.

This backend provides a FastAPI server that integrates with the S³ React dashboard.

## Features

- **Real PE Extraction**: Extracts PE Headers, Sections, Entropy, Strings, and Imports using `pefile`.
- **Machine Learning**: Uses `XGBoost` trained on features derived from the EMBER malware dataset.
- **Explainability**: Uses `SHAP` (SHapley Additive exPlanations) to return the top contributing features for the prediction.
- **Supabase Integration**: Automatically logs scan results to a Supabase database.
- **Integration Ready**: CORS-enabled, low latency API design fully mapped to the frontend expected data structures.

## Setup Instructions

### 1. Prerequisites
- Python 3.9+ 
- Node.js (for the frontend)

*(Note: On Mac ARM/Apple Silicon, ensure `libomp` is installed via Homebrew: `brew install libomp` for XGBoost support).*

### 2. Installation
Create and activate a virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Model Training
Train the initial XGBoost model before starting the server:
```bash
python trainer.py
```
This generates `models/malware_detector.joblib` using realistic PE heuristics based on the EMBER 2018 dataset patterns.

### 4. Supabase Setup (Optional)
To enable cloud logging of scan history, create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 5. Start the API
Start the FastAPI server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoint Reference

### `POST /scan`
**Input**: `.exe`, `.dll`, `.sys` file (multipart/form-data)
**Pipeline**: Data Extraction $\rightarrow$ Machine Learning Inference $\rightarrow$ SHAP Explanation $\rightarrow$ Supabase Logging
**Response**: JSON payload expected by the frontend UI containing prediction, threat score, feature sets, and explainability maps.

### `GET /health`
Returns the status of the server and whether the model is successfully loaded.

## Deployment

The fastAPI app can be easily containerized or deployed to serverless platforms like Render, Railway, or AWS AppRunner.
- Specify the start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Ensure build commands install the `requirements.txt` environment.
