# TeaGuard 🍃  
### Explainable AI Tea Leaf Disease Detection System

TeaGuard is an Explainable AI-based tea leaf disease detection system developed using Deep Learning and Computer Vision techniques. The system identifies tea leaf diseases and pest damage while visually explaining model predictions using Grad-CAM heatmaps.

This project was developed as part of a Master’s research project focused on Explainable AI for agricultural disease detection.

---

# Features

- Tea leaf disease classification using ResNet50
- Explainable AI visualization with Grad-CAM
- Real-time image prediction
- Disease management recommendations
- FastAPI backend
- React frontend
- Multi-class classification for tea leaf diseases and pest conditions

---

# Disease Classes

The system currently supports detection of:

1. Tea algal leaf spot  
2. Brown Blight  
3. Gray Blight  
4. Helopeltis  
5. Red spider  
6. Green mirid bug  
7. Healthy leaf  

---

# Model Performance

| Metric | Score |
|---|---|
| Validation Accuracy | 95% |
| Test Accuracy | 93.86% |
| Macro F1 Score | 92.29% |
| Weighted F1 Score | 93.80% |

---

# Technologies Used

## AI / Machine Learning
- TensorFlow
- Keras
- ResNet50 Transfer Learning
- Grad-CAM Explainability

## Backend
- FastAPI
- Python

## Frontend
- React
- Vite
- CSS

## Image Processing
- OpenCV
- Pillow

---

# Project Structure

```text
TeaGuard/
│
├── backend/
├── frontend/
├── notebooks/
├── results/
└── docs/
```

---

# Installation

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Grad-CAM Explainability

Grad-CAM is used to highlight image regions that contributed most to the model prediction. Warmer colors indicate areas with higher model attention.

---

# Example Outputs

The system provides:

- Disease prediction
- Confidence score
- Top-3 predictions
- Grad-CAM heatmap visualization
- Disease management recommendations

---

# Current Improvements

Ongoing improvements include:

- Real-world image generalization
- Leaf region preprocessing
- Better Grad-CAM visualization
- Camera-based real-time inference

---

# Author

Kodagoda Vithanage Thimantha Sasindu Maduranga  
Master of Information Technology  
KCGI – Kyoto College of Graduate Studies for Informatics

---

# License

This project is developed for academic and research purposes.
