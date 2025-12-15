# 🌱 SIMPLE COLAB MODEL RUNNER
# Copy this entire code into ONE cell in your Colab notebook and run it!

# Step 1: Install packages (run once)
!pip install flask flask-cors pyngrok pillow

# Step 2: Set your ngrok token (get free token from https://dashboard.ngrok.com/signup)
NGROK_TOKEN = "YOUR_NGROK_TOKEN_HERE"  # Replace with your actual token

# Step 3: Run the server
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok
import numpy as np
from PIL import Image
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)

# TODO: Load your actual trained model here
# model = tf.keras.models.load_model('your_model.h5')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Colab model is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_url = data.get('image_url')
        
        # Download and process image
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))
        img = img.convert('RGB')
        img = img.resize((224, 224))  # Adjust to your model's input size
        img_array = np.array(img) / 255.0
        
        # TODO: Replace this with your actual model prediction
        # predictions = model.predict(np.expand_dims(img_array, axis=0))
        # For now, return mock data
        germinated_count = np.random.randint(10, 25)
        total_seeds = np.random.randint(25, 35)
        
        return jsonify({
            "success": True,
            "germinated_count": int(germinated_count),
            "total_seeds": int(total_seeds),
            "germination_rate": round((germinated_count / total_seeds) * 100, 1),
            "confidence": round(np.random.uniform(0.85, 0.98), 2),
            "detection_areas": []
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Start the server
if __name__ == '__main__':
    ngrok.set_auth_token(NGROK_TOKEN)
    public_url = ngrok.connect(5000)
    
    print("\n" + "="*70)
    print("🚀 YOUR COLAB MODEL IS RUNNING!")
    print("="*70)
    print(f"\n📋 COPY THIS URL: {public_url}/predict")
    print(f"\n✅ Test it: {public_url}/health")
    print("\n💡 Paste the /predict URL in your dashboard Settings tab")
    print("="*70 + "\n")
    
    app.run(port=5000)
