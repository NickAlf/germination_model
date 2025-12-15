# 🌱 Colab Model Setup Guide

## Quick Start: Connect Your Germination Model to the Dashboard

### Step 1: Prepare Your Colab Notebook

1. Open Google Colab: https://colab.research.google.com/
2. Create a new notebook or open your existing germination model notebook
3. Install required packages:

\`\`\`python
!pip install flask flask-cors pyngrok opencv-python pillow numpy
\`\`\`

### Step 2: Copy the Server Code

1. Copy the code from `scripts/colab-model-server.py` into a cell in your Colab notebook
2. Modify the prediction logic to use YOUR trained model:

\`\`\`python
# Replace the mock predictions with your actual model
model = tf.keras.models.load_model('your_model.h5')

# In the predict() function:
predictions = model.predict(processed_img)
germinated_count = int(predictions[0])
# ... your model's output processing
\`\`\`

### Step 3: Get Your ngrok Token

1. Sign up for a free ngrok account: https://dashboard.ngrok.com/signup
2. Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Add this to your Colab notebook BEFORE starting the server:

\`\`\`python
from pyngrok import ngrok

# Set your ngrok token
ngrok.set_auth_token("YOUR_NGROK_TOKEN_HERE")
\`\`\`

### Step 4: Start the Server

Run the server in your Colab notebook:

\`\`\`python
start_server()
\`\`\`

You'll see output like:
\`\`\`
🚀 Your Colab model is now available at: https://abc123.ngrok.io
📋 Copy this URL to your dashboard settings:
   https://abc123.ngrok.io/predict
💡 Test with: https://abc123.ngrok.io/health
\`\`\`

### Step 5: Connect to Dashboard

1. Copy the `/predict` endpoint URL (e.g., `https://abc123.ngrok.io/predict`)
2. Open your dashboard at: http://localhost:3000/dashboard
3. Go to **Settings** tab
4. Paste the URL in "Colab Model Endpoint URL"
5. Click **Save Endpoint**

### Step 6: Test Your Model

1. Go to **Analyze Image** tab
2. Paste an image URL or upload from Drive
3. Make sure "Using your Colab model" is selected
4. Click **Analyze with Colab Model**

If the Colab model fails, the dashboard will automatically fall back to ChatGPT!

---

## Expected API Format

Your Colab model endpoint should accept this JSON:

**Request:**
\`\`\`json
{
  "image_url": "https://example.com/seeds.jpg"
}
\`\`\`

**Response:**
\`\`\`json
{
  "germinated_count": 15,
  "total_seeds": 20,
  "germination_rate": 75.0,
  "confidence": 0.92,
  "detection_areas": [
    {"x": 10, "y": 20, "width": 30, "height": 30}
  ]
}
\`\`\`

---

## Troubleshooting

**Problem: "Colab model request timed out"**
- Solution: Your Colab notebook might be sleeping. Run a cell to wake it up.

**Problem: "Failed to connect to Colab endpoint"**
- Solution: Check that ngrok is still running. Free ngrok URLs expire when you close Colab.

**Problem: Model gives wrong predictions**
- Solution: Check your image preprocessing matches your training preprocessing.

**Problem: CORS errors**
- Solution: Make sure `flask-cors` is installed and `CORS(app)` is called.

---

## Alternative: Deploy to Cloud

Instead of ngrok, you can deploy your model to:
- **Hugging Face Spaces** (free)
- **Google Cloud Run** (free tier available)
- **Railway.app** (free tier available)

These provide permanent URLs that don't expire!
