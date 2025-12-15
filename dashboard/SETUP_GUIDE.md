# 🌱 GerminationNet Setup Guide

Complete guide to connect your PyTorch GerminationNet model from Google Colab to your dashboard.

## 📋 Overview

This system connects three components:
1. **Your PyTorch Model** - GerminationNet (ResNet18) trained in Colab
2. **Dashboard** - Web interface for analysis (already deployed)
3. **Google Drive** - Storage for your training data and model weights

## 🚀 Quick Start (5 Minutes)

### Step 1: Open Your Colab Notebook

Open the notebook where your GerminationNet model is trained.

### Step 2: Copy the Server Code

Copy this entire code block and run it in a new Colab cell:

\`\`\`python
# Install dependencies
!pip install flask flask-cors pyngrok requests pillow

import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import requests
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok

# Your GerminationNet model class
class GerminationNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = models.resnet18(weights=None)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, 1)

    def forward(self, x):
        return self.backbone(x).squeeze(1)

# Initialize model
device = "cuda" if torch.cuda.is_available() else "cpu"
model = GerminationNet().to(device)

# Load your trained weights
MODEL_PATH = "/content/drive/MyDrive/germination_project/germination_resnet18.pth"
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

# Image preprocessing (same as training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Create Flask API
app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model": "GerminationNet", "device": device})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_url = data.get('image_url')
        
        if not image_url:
            return jsonify({"error": "image_url required"}), 400
        
        # Download and process image
        response = requests.get(image_url, timeout=10)
        img = Image.open(BytesIO(response.content)).convert('RGB')
        x = transform(img).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            logit = model(x)
            probability = torch.sigmoid(logit).item()
        
        return jsonify({
            "probability": probability,
            "is_germinated": probability >= 0.5,
            "confidence": probability,
            "model": "GerminationNet-ResNet18"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Setup ngrok (get free token at https://ngrok.com)
ngrok.set_auth_token("YOUR_NGROK_TOKEN_HERE")  # ⬅️ REPLACE THIS
public_url = ngrok.connect(5000)

print("\n" + "="*60)
print("🚀 GerminationNet API is RUNNING!")
print("="*60)
print(f"📡 Public URL: {public_url}")
print(f"🔗 Copy this endpoint: {public_url}/predict")
print("="*60 + "\n")

# Run Flask server
app.run(port=5000)
\`\`\`

### Step 3: Get Your ngrok Token

1. Go to [https://ngrok.com](https://ngrok.com)
2. Sign up for a free account
3. Copy your auth token from the dashboard
4. Replace `YOUR_NGROK_TOKEN_HERE` in the code above

### Step 4: Run the Server

1. Run the cell in Colab
2. Wait for the output showing your public URL
3. Copy the URL that ends with `/predict`
4. Example: `https://abc123.ngrok.io/predict`

### Step 5: Connect to Dashboard

1. Go to your dashboard
2. Click the "Settings" tab
3. Paste your ngrok URL into "Colab Model Endpoint URL"
4. Click "Test Connection" to verify
5. Click "Save Endpoint"

### Step 6: Start Analyzing!

1. Go to the "Analyze Image" tab
2. Paste an image URL or upload an image
3. Click "Analyze with Colab Model"
4. Your GerminationNet model will analyze it!

## 🎯 How It Works

\`\`\`
Your Dashboard → Internet → ngrok → Colab → GerminationNet → Response
\`\`\`

1. You upload/paste an image URL in the dashboard
2. Dashboard sends it to your Colab endpoint
3. GerminationNet processes the image
4. Returns germination probability (0-1)
5. Dashboard shows results!

## 🔧 Troubleshooting

### "Cannot connect to Colab endpoint"
- Make sure the Flask server is running in Colab
- Check that ngrok tunnel is active
- Verify you copied the full URL with `/predict`

### "Model file not found"
- Update `MODEL_PATH` to match your Google Drive location
- Make sure Drive is mounted: `drive.mount('/content/drive')`

### "CUDA out of memory"
- Change `device = "cpu"` to force CPU usage
- Or restart your Colab runtime

### "Connection timeout"
- Colab may have gone to sleep - check the notebook
- Refresh the ngrok tunnel by rerunning the cell

## 📊 Response Format

Your model returns:

\`\`\`json
{
  "probability": 0.87,
  "is_germinated": true,
  "confidence": 0.87,
  "model": "GerminationNet-ResNet18"
}
\`\`\`

- `probability`: 0.0 to 1.0 (0% to 100% germinated)
- `is_germinated`: true if probability >= 0.5
- `confidence`: same as probability
- `model`: identifies your model

## 🔄 Automatic Fallback

If your Colab model is unavailable, the dashboard automatically uses ChatGPT as a backup. This ensures your proof of concept always works!

## 💡 Tips

- Keep your Colab notebook open while testing
- ngrok free tier tunnels expire after 2 hours - just restart
- Use the "Test Connection" button before analyzing
- Save your endpoint so you don't have to re-enter it

