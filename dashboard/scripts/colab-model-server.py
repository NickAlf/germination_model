# Run this in your Google Colab notebook to expose your germination model as an API

"""
SETUP INSTRUCTIONS FOR GOOGLE COLAB:

1. Upload your trained germination detection model to Colab
2. Run this script in your Colab notebook
3. Use ngrok to expose the endpoint publicly
4. Copy the ngrok URL to your dashboard settings

REQUIREMENTS:
!pip install flask flask-cors pyngrok opencv-python pillow numpy tensorflow
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok
import numpy as np
import cv2
from PIL import Image
import io
import requests
from typing import Dict, List
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for web requests

# Load your trained model here
# model = load_your_model('path_to_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to analyze seed germination images
    
    Expected JSON input:
    {
      "image_url": "https://example.com/image.jpg"
      // OR
      "image_base64": "base64_encoded_image_data"
    }
    
    Returns JSON:
    {
      "germinated_count": 15,
      "total_seeds": 20,
      "germination_rate": 75.0,
      "confidence": 0.92,
      "detection_areas": [
        {"x": 10, "y": 20, "width": 30, "height": 30},
        ...
      ]
    }
    """
    try:
        data = request.json
        
        # Get image from URL or base64
        if 'image_url' in data:
            response = requests.get(data['image_url'])
            image = Image.open(io.BytesIO(response.content))
        elif 'image_base64' in data:
            image_data = base64.b64decode(data['image_base64'])
            image = Image.open(io.BytesIO(image_data))
        else:
            return jsonify({'error': 'No image provided'}), 400
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Preprocess image for your model
        # processed_img = preprocess_image(img_array)
        
        # Run inference with your model
        # predictions = model.predict(processed_img)
        
        # For demo purposes, return mock data
        # Replace this with your actual model predictions
        germinated_count = 15
        total_seeds = 20
        germination_rate = (germinated_count / total_seeds) * 100
        confidence = 0.92
        
        detection_areas = [
            {"x": 10, "y": 20, "width": 30, "height": 30},
            {"x": 50, "y": 60, "width": 25, "height": 25},
        ]
        
        return jsonify({
            'germinated_count': germinated_count,
            'total_seeds': total_seeds,
            'germination_rate': germination_rate,
            'confidence': confidence,
            'detection_areas': detection_areas
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model': 'loaded'})

# Start ngrok tunnel
def start_server():
    # Start ngrok tunnel
    public_url = ngrok.connect(5000)
    print(f'\n🚀 Your Colab model is now available at: {public_url}')
    print(f'\n📋 Copy this URL to your dashboard settings:')
    print(f'   {public_url}/predict')
    print(f'\n💡 Test with: {public_url}/health')
    
    # Run Flask app
    app.run(port=5000)

if __name__ == '__main__':
    start_server()
