# 🚀 Quick Start: Run Your Model in 3 Minutes

## Step 1: Get ngrok Token (30 seconds)
1. Go to: https://dashboard.ngrok.com/signup
2. Sign up (free)
3. Copy your token from: https://dashboard.ngrok.com/get-started/your-authtoken

## Step 2: Run in Colab (1 minute)
1. Open Google Colab: https://colab.research.google.com/
2. Create a new notebook
3. Copy ALL the code from `COLAB_RUN_THIS.py` into one cell
4. Replace `YOUR_NGROK_TOKEN_HERE` with your actual token
5. Click the ▶️ play button

## Step 3: Connect to Dashboard (30 seconds)
1. Wait for the output: `📋 COPY THIS URL: https://xxxxx.ngrok.io/predict`
2. Copy that URL
3. Open your dashboard: http://localhost:3000/dashboard
4. Go to **Settings** tab
5. Paste the URL
6. Click **Save**

## Step 4: Test It! (30 seconds)
1. Go to **Analyze Image** tab
2. Click "Use Sample Image"
3. Click **Analyze with Colab Model**

Done! Your model is connected!

---

## ⚠️ Important Notes

- **Free ngrok URLs expire** when you close Colab. Just restart and get a new URL.
- **Replace the mock predictions** with your actual model code where it says `TODO`
- **ChatGPT is the backup** - if Colab fails, analysis still works!

## 🔧 Customize Your Model

Find this section in the code:
\`\`\`python
# TODO: Replace this with your actual model prediction
# predictions = model.predict(np.expand_dims(img_array, axis=0))
\`\`\`

Replace with:
\`\`\`python
# Load your model (do this once at the top)
model = tf.keras.models.load_model('/content/drive/MyDrive/your_model.h5')

# Then in the predict() function:
predictions = model.predict(np.expand_dims(img_array, axis=0))
germinated_count = int(predictions[0][0] * 100)  # Adjust based on your output
