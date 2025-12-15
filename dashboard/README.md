# 🌱 Microgreens Check - GerminationNet Dashboard


## What You Have

**Dashboard** at `/` (homepage) with navigation tabs:
- **Dashboard** - View stats, quick actions, growing conditions
- **Tracker** - Track germination records over time  
- **AI Analysis** - Test GerminationNet model or ChatGPT at `/analyze`
- **Dataset** - Explore seed varieties
- **Results** - View analytics and metrics

**Key Features:**
- ✅ PyTorch ResNet18 GerminationNet model integration
- ✅ ChatGPT automatic fallback
- ✅ Google Drive image loading
- ✅ Supabase database for tracking
- ✅ Real-time analysis with confidence scores

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Your GerminationNet Model in Colab

1. Open your Colab notebook with the trained GerminationNet model
2. Make sure Google Drive is mounted: `drive.mount('/content/drive')`
3. Copy the complete server code from `scripts/germination-net-server.py`
4. Replace `YOUR_NGROK_TOKEN_HERE` with your token from [ngrok.com](https://ngrok.com)
5. Run the cell
6. Copy the URL ending with `/predict` (e.g., `https://abc123.ngrok.io/predict`)

**Your GerminationNet Model Structure:**
\`\`\`python
class GerminationNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = models.resnet18(weights=IMAGENET1K_V1)
        self.backbone.fc = nn.Linear(512, 1)  # Binary classification
    
    def forward(self, x):
        return self.backbone(x).squeeze(1)
\`\`\`

### Step 2: Connect Dashboard to Your Model

1. Go to your dashboard homepage
2. Click **AI Analysis** tab or go to `/analyze`
3. Upload or paste a seed image URL
4. The system will use your GerminationNet model automatically
5. If Colab is offline, ChatGPT provides instant backup analysis

### Step 3: Test Your Model

1. Use test images from your Google Drive
2. Compare GerminationNet predictions with ChatGPT
3. View germination probability (0-1 scale)
4. See confidence scores and growth assessments

## 📊 How GerminationNet Works

Your model analyzes seed images and returns:
\`\`\`json
{
  "probability": 0.87,
  "is_germinated": true,
  "confidence": 0.87,
  "model": "GerminationNet-ResNet18"
}
\`\`\`

- **Probability**: 0.0 to 1.0 (germination likelihood)
- **Threshold**: >= 0.5 = germinated
- **Training**: ResNet18 backbone, ImageNet pretrained weights
- **Input**: 224x224 RGB images, normalized

## 🔧 Environment Variables

Already configured in your project:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase database
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase auth
- `BLOB_READ_WRITE_TOKEN` - Image storage
- `DRIVE_FOLDER_ID` - Google Drive folder

## 🎯 API Endpoints

Your dashboard uses these routes:

**Analysis with GerminationNet:**
\`\`\`
POST /api/analyze-germination
Body: {
  "imageUrl": "https://...",
  "useColab": true,
  "colabEndpoint": "https://abc123.ngrok.io/predict"
}
\`\`\`

**Tray Detection (multi-seed analysis):**
\`\`\`
POST /api/analyze-tray-germination
Body: {
  "image": "base64_string"
}
\`\`\`

## 📱 Dashboard Features

**Homepage (`/`)**
- Total records counter
- Active growing tracker
- Photos analyzed count
- Success rate with progress bar
- Quick action buttons
- Growing conditions monitor (temp, humidity, light)
- Seed variety distribution chart

**AI Analysis (`/analyze`)**
- Upload seed images
- Instant GerminationNet predictions
- Automatic ChatGPT fallback
- Confidence scoring
- Growth stage assessment
- Export results as JSON

## 🔄 Dual AI System

1. **Primary**: Your GerminationNet PyTorch model (via Colab)
2. **Backup**: ChatGPT GPT-4o-mini (automatic fallback)

Benefits:
- Always available (even if Colab sleeps)
- Compare model vs. GPT results
- Perfect for proof of concept
- No downtime during testing

## 🎓 For Your Thesis

Document these components:

**Model Architecture:**
- ResNet18 backbone (pretrained ImageNet)
- Binary classification head (1 output)
- Sigmoid activation for probability
- BCE loss function

**Training Setup:**
- 10 epochs with Adam optimizer
- Data augmentation (random crop, flip, color jitter)
- Train/val/test split from Drive data
- Performance metrics: accuracy, ROC-AUC

**Deployment:**
- Flask REST API in Google Colab
- ngrok tunnel for public access
- Next.js web dashboard
- Dual AI strategy (model + GPT fallback)

**Integration:**
- RESTful API communication
- Base64 image transfer
- Real-time prediction display
- Confidence score visualization

## 📚 Additional Guides

- `SETUP_GUIDE.md` - Complete GerminationNet setup walkthrough
- `scripts/germination-net-server.py` - Flask server for Colab
- `lib/germination-net.ts` - TypeScript integration code
- `lib/colab-model.ts` - API communication layer

## 🐛 Troubleshooting

**"supabaseUrl is required"**
- Environment variables are already configured
- Check Vars section in v0 sidebar if needed

**"Cannot reach Colab endpoint"**
- Verify your Colab notebook is running
- Check ngrok tunnel is active (free tier = 2hr limit)
- Test connection in Settings tab

**"Model predictions incorrect"**
- Verify model weights path in Colab
- Check image preprocessing matches training
- Test with known validation images

**"Connection timeout"**
- Colab may have slept - refresh the notebook
- Restart the Flask server cell
- Falls back to ChatGPT automatically

## 🚀 Next Steps

1. ✅ Test with your validation dataset images
2. ✅ Compare GerminationNet vs ChatGPT accuracy
3. ✅ Document prediction confidence levels
4. ✅ Export results for thesis analysis
5. ✅ Add batch processing for multiple images

## 💡 Pro Tips

- Keep Colab notebook open during testing
- Use validation images you know the ground truth for
- Test both germinated and non-germinated seeds
- Compare probability scores across different growth stages
- Document when ChatGPT fallback activates