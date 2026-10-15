import os
import uuid
import cv2
import numpy as np
import tensorflow as tf
import tf_keras as legacy_keras

from PIL import Image
from fastapi import FastAPI, UploadFile, File, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# =========================================================
# ENVIRONMENT & COMPATIBILITY LAYER CONFIG
# =========================================================
os.environ["TF_USE_LEGACY_KERAS"] = "1"

# Import ResNet50 explicitly from tf_keras to match tensor types
from tf_keras.applications.resnet50 import preprocess_input, ResNet50

# =========================================================
# CONFIG
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_resnet50_inference.keras")

IMG_SIZE = 224

CLASS_NAMES = [
    "Tea algal leaf spot",
    "Brown Blight",
    "Gray Blight",
    "Helopeltis",
    "Red spider",
    "Green mirid bug",
    "Healthy leaf",
]

DISEASE_META = {
    "Tea algal leaf spot": {"severity": "Medium", "color": "#9b8f2f"},
    "Brown Blight": {"severity": "High", "color": "#c0392b"},
    "Gray Blight": {"severity": "Medium", "color": "#7f8c8d"},
    "Helopeltis": {"severity": "High", "color": "#e67e22"},
    "Red spider": {"severity": "High", "color": "#e74c3c"},
    "Green mirid bug": {"severity": "High", "color": "#27ae60"},
    "Healthy leaf": {"severity": "None", "color": "#2ecc71"},
}

# =========================================================
# FASTAPI INITIALIZATION
# =========================================================
app = FastAPI(
    title="TeaGuard API",
    description="Tea Leaf Disease Detection API",
    version="1.0.0"
)

# =========================================================
# CORS MIDDLEWARE
# =========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# STATIC FOLDER DIRECTORIES
# =========================================================
STATIC_DIR = os.path.join(BASE_DIR, "static")
GRADCAM_DIR = os.path.join(STATIC_DIR, "gradcam")

os.makedirs(GRADCAM_DIR, exist_ok=True)

app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static"
)

# =========================================================
# LOAD COMPATIBILITY MODEL
# =========================================================
print("Loading model...")
if not os.path.exists(MODEL_PATH):
    # Fallback to current working directory checking if path resolution shifts
    MODEL_PATH = "best_resnet50_inference.keras"

model = legacy_keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")

# =========================================================
# IMAGE PREPROCESSING & REGION EXTRACTION
# =========================================================
def crop_leaf_region(image):
    img_np = np.array(image)
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)

    # Green/brown leaf mask range
    lower = np.array([15, 20, 20])
    upper = np.array([95, 255, 255])

    mask = cv2.inRange(hsv, lower, upper)
    kernel = np.ones((7, 7), np.uint8)

    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return image, (0, 0, image.width, image.height)

    largest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest)

    padding = 20
    x1 = max(x - padding, 0)
    y1 = max(y - padding, 0)
    x2 = min(x + w + padding, img_np.shape[1])
    y2 = min(y + h + padding, img_np.shape[0])

    box = (x1, y1, x2, y2)
    return image.crop(box), box


def read_image(file):
    original = Image.open(file).convert("RGB")
    cropped, crop_box = crop_leaf_region(original)

    model_image = cropped.resize((IMG_SIZE, IMG_SIZE))

    raw_img = np.array(model_image, dtype=np.float32)
    original_rgb = np.array(original, dtype=np.uint8)

    return raw_img, original_rgb, crop_box


def preprocess_image(raw_img):
    img_array = np.expand_dims(raw_img.copy(), axis=0)
    return preprocess_input(img_array)

# =========================================================
# BUILD GRAD-CAM MODEL ARCHITECTURES
# =========================================================
print("Preparing Grad-CAM models...")

trained_resnet = model.get_layer("resnet50")

resnet_for_gradcam = ResNet50(
    weights=None,
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
)
resnet_for_gradcam.set_weights(trained_resnet.get_weights())

last_conv_layer = resnet_for_gradcam.get_layer("conv5_block3_out")

# Use legacy_keras frameworks to resolve 'Functional' class deserialization errors
grad_model = legacy_keras.models.Model(
    inputs=resnet_for_gradcam.input,
    outputs=[last_conv_layer.output, resnet_for_gradcam.output]
)

classifier_input = legacy_keras.Input(shape=resnet_for_gradcam.output_shape[1:])
x_tensor = classifier_input

for layer in model.layers:
    if layer.name not in ["input_layer", "input_1", "resnet50"]:
        x_tensor = layer(x_tensor)

classifier_model = legacy_keras.Model(classifier_input, x_tensor)
print("Grad-CAM models ready!")

# =========================================================
# GRAD-CAM COMPUTATION ENGINE
# =========================================================
def make_gradcam_heatmap(raw_img, pred_index):
    img_array = preprocess_image(raw_img)

    with tf.GradientTape() as tape:
        conv_outputs, features = grad_model(img_array)
        predictions = classifier_model(features)
        class_channel = predictions[:, pred_index]

    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = np.maximum(heatmap.numpy(), 0)
    max_val = np.max(heatmap)

    if max_val != 0:
        heatmap = heatmap / max_val

    return heatmap


def save_gradcam(original_rgb, heatmap, crop_box):
    x1, y1, x2, y2 = crop_box

    # Map the heatmap back to the region used for inference.
    resized_heatmap = cv2.resize(
        heatmap,
        (x2 - x1, y2 - y1),
        interpolation=cv2.INTER_LINEAR,
    )

    heatmap_uint8 = np.uint8(
        255 * np.clip(resized_heatmap, 0, 1)
    )

    heatmap_color = cv2.applyColorMap(
        heatmap_uint8,
        cv2.COLORMAP_JET,
    )
    heatmap_color = cv2.cvtColor(
        heatmap_color,
        cv2.COLOR_BGR2RGB,
    )
    heatmap_color = cv2.GaussianBlur(
        heatmap_color, (7, 7), 0
    )

    # Preserve the original proportions and surrounding image.
    overlay = original_rgb.copy()
    original_crop = original_rgb[y1:y2, x1:x2]

    overlay[y1:y2, x1:x2] = cv2.addWeighted(
        original_crop, 0.6,
        heatmap_color, 0.4,
        0,
    )

    filename = f"{uuid.uuid4().hex}.png"
    save_path = os.path.join(GRADCAM_DIR, filename)

    Image.fromarray(overlay).save(save_path)
    return filename

# =========================================================
# RECOMMENDATION ENGINE
# =========================================================
def get_recommendation(disease):
    recommendations = {
        "Tea algal leaf spot": "Improve air circulation and avoid excess leaf moisture.",
        "Brown Blight": "Consider fungicide treatment and remove infected leaves.",
        "Gray Blight": "Monitor humidity levels and improve field sanitation.",
        "Helopeltis": "Inspect for pest spread and apply pest management practices.",
        "Red spider": "Check underside of leaves and monitor mite infestation.",
        "Green mirid bug": "Use pest control management and inspect nearby plants.",
        "Healthy leaf": "No disease detected. Continue regular monitoring.",
    }
    return recommendations.get(disease, "Please consult an agricultural expert.")

# =========================================================
# ENDPOINTS / ROUTES
# =========================================================
@app.get("/")
def home():
    return {"message": "TeaGuard API is running successfully!"}


@app.post("/predict")
async def predict(request: Request, file: UploadFile = File(...)):
    try:
        # Read and prepare raw image array
        raw_img, original_rgb, crop_box = read_image(file.file)
        
        # Calculate full model predictions
        img_array = preprocess_image(raw_img)
        preds = model.predict(img_array)
        pred_index = int(np.argmax(preds[0]))
        confidence = float(preds[0][pred_index])
        
        disease_name = CLASS_NAMES[pred_index]
        meta = DISEASE_META.get(disease_name, {"severity": "Unknown", "color": "#000000"})
        recommendation = get_recommendation(disease_name)
        
        # Calculate and export Grad-CAM overlay visualization
        heatmap = make_gradcam_heatmap(raw_img, pred_index)
        gradcam_filename = save_gradcam( original_rgb, heatmap, crop_box)
        
        base_url = str(request.base_url)
        gradcam_url = f"{base_url}static/gradcam/{gradcam_filename}"
        
        return {
            "status": "success",
            "prediction": {
                "class_name": disease_name,
                "confidence": confidence,
                "severity": meta["severity"],
                "color": meta["color"],
                "recommendation": recommendation,
                "gradcam_url": gradcam_url
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# =========================================================
# SERVER INIT PROTECTION FOR WINDOWS WORKERS
# =========================================================
if __name__ == "__main__":
    import uvicorn
    # Initializing direct app strings prevents sub-process cloning environment drops
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
