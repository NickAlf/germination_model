"""
Flask API server to run the Python model
Run this separately: python flask-api-server.py
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from germination_detector import GerminationDetector

app = Flask(__name__)
CORS(app)  # Allow requests from Next.js

# Initialize detector with your trained model
detector = GerminationDetector('models/yolov8_tray_detector.pt')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    start_time = time.time()
    
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Process image
        result = detector.process_image(image_data)
        result['processingTime'] = time.time() - start_time
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
