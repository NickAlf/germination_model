# Run this in your Google Colab notebook to expose your GerminationNet model
# This creates a Flask API that your dashboard can connect to

# 1. Install dependencies
# !pip install flask flask-cors pyngrok requests pillow

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

# Load your trained GerminationNet model
class GerminationNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = models.resnet18(weights=None)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, 1)

    def forward(self, x):
        return self.backbone(x).squeeze(1)

# Initialize
device = "cuda" if torch.cuda.is_available() else "cpu"
model = GerminationNet().to(device)

# Load your trained weights
MODEL_PATH = "/content/drive/MyDrive/germination_project/germination_resnet18.pth"
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Flask app
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
        
        # Download image
        response = requests.get(image_url, timeout=10)
        img = Image.open(BytesIO(response.content)).convert('RGB')
        
        # Preprocess and predict
        x = transform(img).unsqueeze(0).to(device)
        
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

# Start ngrok tunnel
# Set your ngrok token first: ngrok.set_auth_token("YOUR_TOKEN")
ngrok.set_auth_token("YOUR_NGROK_TOKEN_HERE")
public_url = ngrok.connect(5000)
print(f"\n🚀 GerminationNet API is running!")
print(f"📡 Public URL: {public_url}")
print(f"🔗 Use this endpoint: {public_url}/predict\n")

# Run Flask
app.run(port=5000)
