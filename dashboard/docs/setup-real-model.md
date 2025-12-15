# Setting Up Real Model Inference

## Requirements

### 1. Install Python Dependencies

\`\`\`bash
pip install ultralytics opencv-python numpy pillow flask flask-cors
\`\`\`

### 2. Train Your YOLO Model

You need to train a YOLOv8 model on your tray dataset:

\`\`\`python
from ultralytics import YOLO

# Load a pretrained model
model = YOLO('yolov8n.pt')

# Train on your dataset
results = model.train(
    data='tray_dataset.yaml',  # Your dataset config
    epochs=100,
    imgsz=640,
    batch=16
)

# Save the trained model
model.save('models/yolov8_tray_detector.pt')
\`\`\`

### 3. Dataset Structure

\`\`\`
dataset/
├── train/
│   ├── images/
│   └── labels/
├── val/
│   ├── images/
│   └── labels/
└── tray_dataset.yaml
\`\`\`

**tray_dataset.yaml:**
\`\`\`yaml
path: ./dataset
train: train/images
val: val/images

nc: 1  # number of classes
names: ['tray']
\`\`\`

### 4. Run Python Backend

\`\`\`bash
# Start Flask server
python scripts/flask-api-server.py
\`\`\`

### 5. Configure Next.js

Create \`.env.local\`:
\`\`\`
PYTHON_API_URL=http://localhost:5000
\`\`\`

### 6. Start Next.js App

\`\`\`bash
npm run dev
\`\`\`

## Deployment Options

### Option A: Deploy Python on Vercel
❌ Not recommended - Vercel has limited Python support

### Option B: Deploy Python on Railway/Render
✅ Recommended for Python Flask apps

### Option C: Use Google Colab + ngrok
✅ Good for testing/development

\`\`\`python
# In Google Colab
!pip install flask pyngrok ultralytics opencv-python

from pyngrok import ngrok
# Run your Flask app
# Get public URL from ngrok
\`\`\`

### Option D: Cloud Functions (AWS Lambda, Google Cloud)
✅ Serverless deployment

## Current Status

Right now the app uses **MOCK DATA** for demonstration.

To use real inference:
1. Train your YOLO model
2. Run the Python Flask server
3. Set PYTHON_API_URL environment variable
4. The Next.js app will automatically use real inference
\`\`\`
