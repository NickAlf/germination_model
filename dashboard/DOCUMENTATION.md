# Microgreens Check - Simple Documentation

## What This App Does

This is a seed germination detection system that uses AI to analyze if seeds have germinated. You can upload a photo of seeds and get instant results.

---

## The App Structure

### Two Main Pages

1. **Homepage** (`/`) - Dashboard with stats and quick access
2. **Analyze Page** (`/analyze`) - Upload photos and get AI analysis

That's it. Simple and focused.

---

## How It Works

### 1. Homepage Dashboard

When you visit the app, you see:

- **Stats Cards**: Shows how many records you have, photos analyzed, and success rate
- **Quick Actions**: Two big buttons
  - Start New Germination Record
  - Analyze Photo with AI
- **Growing Conditions**: Shows temperature, humidity, and light hours

### 2. AI Analysis Page

Upload a seed photo and the system:

1. Sends the image to AI
2. Analyzes if seeds are germinated
3. Shows you the results with confidence score

---

## The Technology Stack

### Frontend (What Users See)
- **Next.js 14** - The web framework
- **React** - For building the interface
- **Tailwind CSS** - For styling
- **Recharts** - For charts and graphs

### Backend (What Runs the App)
- **Next.js API Routes** - Handle requests
- **Supabase** - Database for storing records
- **OpenAI GPT-4o-mini** - AI for image analysis
- **Vercel Blob** - For storing images

### AI Models
- **Primary**: Your GerminationNet PyTorch model (runs in Google Colab)
- **Backup**: ChatGPT (always available)

---

## Database Structure

The app uses 4 tables in Supabase:

### 1. `users`
Stores user information:
- id, email, name, role
- Tracks who owns which records

### 2. `germination_records`
Main tracking table:
- seed_type (what you're growing)
- planting_date
- expected_germination_days
- current_stage (sprouting, growing, etc.)

### 3. `photo_records`
Every photo you upload:
- photo_url (where the image is stored)
- ai_analysis (what the AI said)
- ai_model_used (which model analyzed it)
- day_number (day since planting)

### 4. `germination_progress`
Track growth over time:
- day_number
- actual_germination_rate
- environmental_conditions (temp, humidity)
- growth_stage

---

## Key Files Explained

### Pages

\`\`\`
app/
├── page.tsx              → Homepage dashboard
├── analyze/page.tsx      → AI analysis page
└── layout.tsx            → Wraps all pages (fonts, styles)
\`\`\`

### API Routes (Backend)

\`\`\`
app/api/
├── analyze-germination/route.ts    → Connects to your Colab model
├── analyze-photo/route.ts          → Uses ChatGPT to analyze
├── upload-photo/route.ts           → Handles image uploads
├── germination/
│   ├── create/route.ts             → Creates new records
│   ├── list/route.ts               → Gets all records
│   └── update/route.ts             → Updates records
└── analytics/
    └── dashboard/route.ts          → Gets stats for homepage
\`\`\`

### Important Libraries

\`\`\`
lib/
├── supabase.ts           → Database connection
├── germination-net.ts    → Connects to your PyTorch model
├── colab-model.ts        → API calls to Colab
└── ai-models.ts          → AI model configurations
\`\`\`

### Components (Reusable UI)

\`\`\`
components/
├── photo-upload.tsx      → Image upload widget
├── germination-chart.tsx → Charts for tracking
└── ui/                   → Basic components (button, card, etc.)
\`\`\`

---

## How AI Analysis Works

### Option 1: Your GerminationNet Model (Colab)

**What happens:**
1. You run your PyTorch model in Google Colab
2. Colab creates a public URL using ngrok
3. Your dashboard sends images to that URL
4. Your model analyzes and returns results

**Model Details:**
- Architecture: ResNet18
- Task: Binary classification (germinated or not)
- Output: Probability score 0.0 to 1.0
- Threshold: >= 0.5 means germinated

### Option 2: ChatGPT Backup

**What happens:**
1. If Colab is unavailable, uses ChatGPT automatically
2. Sends image to OpenAI's GPT-4o-mini
3. Gets detailed analysis of the seeds
4. Shows results the same way


---

## Environment Variables

These are already set up in your project:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL          → Database connection
NEXT_PUBLIC_SUPABASE_ANON_KEY     → Database access
SUPABASE_SERVICE_ROLE_KEY         → Admin database access
BLOB_READ_WRITE_TOKEN             → Image storage
DRIVE_FOLDER_ID                   → Google Drive folder
\`\`\`

You don't need to add these - they're configured in Vercel.

---

## API Endpoints Reference

### Analyze with GerminationNet
\`\`\`
POST /api/analyze-germination

Body:
{
  "imageUrl": "https://...",
  "useColab": true,
  "colabEndpoint": "https://your-ngrok-url.io/predict"
}

Response:
{
  "probability": 0.87,
  "is_germinated": true,
  "confidence": 0.87,
  "model": "GerminationNet-ResNet18"
}
\`\`\`

### Analyze with ChatGPT
\`\`\`
POST /api/analyze-photo

Body:
{
  "image": "base64_encoded_image" or "imageUrl": "https://..."
}

Response:
{
  "analysis": "Seeds show clear germination...",
  "confidence": 0.85,
  "germination_detected": true
}
\`\`\`

### Create Germination Record
\`\`\`
POST /api/germination/create

Body:
{
  "seed_type": "Basil",
  "planting_date": "2024-01-15",
  "expected_germination_days": 7
}

Response:
{
  "id": "uuid",
  "created_at": "timestamp"
}
\`\`\`

---

## How to Connect Your Colab Model

### Step 1: Prepare Colab

1. Open your Colab notebook
2. Mount Google Drive if needed:
   \`\`\`python
   from google.colab import drive
   drive.mount('/content/drive')
   \`\`\`

### Step 2: Copy Server Code

Use the Flask server code in `scripts/germination-net-server.py`

The key parts:
\`\`\`python
# Load your trained model
model = torch.load('/path/to/your/model.pth')

# Create API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    # Receives image
    # Runs through model
    # Returns probability
\`\`\`

### Step 3: Start Server

\`\`\`python
# Install requirements
!pip install flask flask-cors pyngrok

# Get ngrok token from ngrok.com
!ngrok authtoken YOUR_TOKEN_HERE

# Run server
from pyngrok import ngrok
public_url = ngrok.connect(5000)
print(f"Model available at: {public_url}/predict")
\`\`\`

### Step 4: Use the URL

Copy the ngrok URL and paste it in the analyze page settings.

---

## Data Flow Diagram

\`\`\`
User uploads image
       ↓
Frontend (React)
       ↓
API Route (/api/analyze-germination)
       ↓
    ┌─────────────┐
    │  Try Colab  │
    │   Model     │ → Success → Return results
    └─────────────┘
       ↓ Fails
    ┌─────────────┐
    │  ChatGPT    │ → Success → Return results
    │  Backup     │
    └─────────────┘
       ↓
Save to Supabase
       ↓
Show results to user
\`\`\`

---

## Common Tasks

### Add a New Seed Record
1. Go to homepage
2. Click "Start New Germination Record"
3. Fill in seed type and planting date
4. Save

### Analyze a Photo
1. Click "Analyze Photo with AI"
2. Upload an image
3. Wait for results
4. View germination probability

### Check Stats
1. Homepage shows overview
2. Total records
3. Success rate
4. Photos analyzed

---

## For Your Thesis

### Document These Sections

**1. System Architecture**
- Next.js full-stack application
- Dual AI system (custom model + GPT)
- Supabase PostgreSQL database
- RESTful API design

**2. Model Integration**
- Flask API in Google Colab
- ngrok for public access
- Base64 image encoding
- Real-time predictions

**3. User Interface**
- Dashboard for quick overview
- Analysis page for testing
- Responsive design
- Real-time feedback

**4. Data Storage**
- Relational database (Supabase)
- Image storage (Vercel Blob)
- User authentication
- Record tracking over time

---

## Troubleshooting

### "Cannot connect to database"
- Environment variables are set automatically
- Check Supabase integration in v0 sidebar

### "Model not responding"
- Make sure Colab notebook is running
- Check ngrok tunnel is active
- Verify the URL ends with `/predict`
- System falls back to ChatGPT automatically

### "Image upload fails"
- Check file size (max 10MB)
- Use JPG or PNG format
- Verify BLOB_READ_WRITE_TOKEN is set

---

## Development Commands

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

---

## File Structure Summary

\`\`\`
microgreen-germination-tracker/
├── app/                      → Pages and API routes
│   ├── page.tsx             → Homepage
│   ├── analyze/page.tsx     → AI analysis
│   └── api/                 → Backend endpoints
├── components/              → Reusable UI components
├── lib/                     → Utility functions
├── scripts/                 → Python server for Colab
├── docs/                    → Architecture diagrams
└── public/                  → Static files
\`\`\`

---

## Summary

This is a **simple two-page app** that:

1. Shows a dashboard with germination stats
2. Lets you upload photos for AI analysis
3. Connects to your PyTorch model in Colab
4. Falls back to ChatGPT if needed
5. Stores everything in Supabase database

The goal is to make seed germination analysis easy and accessible for your research.

---

**Questions?** Check the README.md or SETUP_GUIDE.md for more details.
