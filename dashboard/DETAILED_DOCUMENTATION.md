# Microgreens Check - Complete Technical Documentation

**Last Updated:** December 2024  
**Version:** 2.0  
**Purpose:** Seed germination detection using AI (Custom PyTorch model + Demo fallback)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Application Structure](#application-structure)
3. [File-by-File Documentation](#file-by-file-documentation)
4. [Database Architecture](#database-architecture)
5. [API Endpoints](#api-endpoints)
6. [AI Model Integration](#ai-model-integration)
7. [Data Flow](#data-flow)
8. [Setup Instructions](#setup-instructions)

---

## System Overview

### What This System Does

This is a full-stack web application for analyzing seed germination using artificial intelligence. Users can upload photos of seed trays and receive instant AI-powered analysis about germination status.

### Key Features

- **Dashboard**: View statistics, active experiments, and success rates
- **AI Analysis**: Upload photos for germination detection
- **Dual AI System**: 
  - Primary: Custom GerminationNet PyTorch model (runs in Google Colab)
  - Fallback: Demo data when Colab is not connected
- **Database Storage**: Track experiments, photos, and progress over time

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL database)
- Vercel Blob (image storage)

**AI/ML:**
- PyTorch (custom GerminationNet model)
- ResNet18 architecture
- Flask API (Colab server)
- ngrok (public tunnel)

---

## Application Structure

### Directory Layout

\`\`\`
microgreen-germination-tracker/
├── app/                          # Next.js pages and API routes
│   ├── page.tsx                 # Homepage dashboard (/)
│   ├── layout.tsx               # Root layout with fonts & metadata
│   ├── globals.css              # Global styles & Tailwind
│   ├── analyze/
│   │   └── page.tsx            # AI analysis page (/analyze)
│   └── api/                     # Backend API endpoints
│       ├── analyze-germination/  # Main AI analysis endpoint
│       ├── analyze-photo/        # Alternative photo analysis
│       ├── upload-photo/         # Image upload handler
│       ├── germination/          # CRUD operations
│       │   ├── create/          # Create new record
│       │   ├── list/            # List all records
│       │   └── update/          # Update record
│       └── analytics/
│           └── dashboard/        # Dashboard statistics
│
├── components/                   # React components
│   ├── tray-germination-detector.tsx  # Main analysis UI
│   ├── photo-upload.tsx         # Image upload widget
│   ├── germination-chart.tsx    # Data visualization
│   └── ui/                      # Shadcn components
│
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Database client
│   ├── germination-net.ts      # Colab model API
│   ├── ai-models.ts            # AI configuration
│   ├── types.ts                # TypeScript definitions
│   └── utils.ts                # Helper functions
│
├── scripts/                     # Python scripts
│   └── germination-net-server.py  # Colab Flask server
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md         # System diagrams
│  
└── public/                      # Static assets
\`\`\`

---

## File-by-File Documentation

### Core Pages

#### `app/page.tsx` - Homepage Dashboard

**Location:** `app/page.tsx`  
**Route:** `/`  
**Purpose:** Main dashboard showing statistics and quick actions

**What it does:**
1. Fetches analytics from `/api/analytics/dashboard`
2. Displays 4 stat cards: Total Records, Active Growing, Photos Analyzed, Success Rate
3. Shows Quick Actions button to analyze photos
4. Displays mock growing conditions (temperature, humidity, light)

**Key Components Used:**
- Card components from `@/components/ui/card`
- Button from `@/components/ui/button`
- Icons from `lucide-react`

**State Management:**
\`\`\`typescript
const [stats, setStats] = useState({
  totalRecords: 0,
  activeGrowing: 0,
  photosAnalyzed: 0,
  successRate: 0,
})
\`\`\`

**API Calls:**
- `GET /api/analytics/dashboard` - Fetches all statistics

---

#### `app/analyze/page.tsx` - AI Analysis Page

**Location:** `app/analyze/page.tsx`  
**Route:** `/analyze`  
**Purpose:** Upload and analyze seed germination photos

**What it does:**
1. Renders header with branding
2. Loads `TrayGerminationDetector` component
3. Provides navigation back to homepage

**Key Features:**
- Clean layout with consistent branding
- Settings button (placeholder for future features)
- Full-width analysis interface

---

#### `app/layout.tsx` - Root Layout

**Location:** `app/layout.tsx`  
**Purpose:** Wraps entire application with fonts and metadata

**What it includes:**
- Font configuration (Inter from Google Fonts)
- HTML metadata (title, description)
- Global CSS imports
- Theme provider setup

**Important Settings:**
\`\`\`typescript
export const metadata = {
  title: "Microgreens Germination Tracker",
  description: "AI-powered seed germination analysis",
}
\`\`\`

---

### Key Components

#### `components/tray-germination-detector.tsx`

**Purpose:** Main UI component for uploading and analyzing images

**Features:**
1. **Image Upload Section**
   - Drag & drop support
   - File picker
   - Image preview
   - File size limit (10MB)

2. **Colab Settings**
   - Input field for ngrok URL
   - Enable/disable toggle
   - Connection test button
   - Health check status

3. **Analysis Results**
   - Germination probability
   - Confidence score
   - Model source badge
   - Visual feedback

**State Variables:**
\`\`\`typescript
const [selectedImage, setSelectedImage] = useState<File | null>(null)
const [imagePreview, setImagePreview] = useState<string>("")
const [isAnalyzing, setIsAnalyzing] = useState(false)
const [analysisResult, setAnalysisResult] = useState<any>(null)
const [colabEndpoint, setColabEndpoint] = useState("")
const [useColab, setUseColab] = useState(false)
\`\`\`

**Main Function:**
\`\`\`typescript
const handleAnalysis = async () => {
  // 1. Upload image to Vercel Blob
  // 2. Call /api/analyze-germination with image URL
  // 3. Display results
}
\`\`\`

**API Integration:**
- `POST /api/analyze-germination` - Main analysis endpoint
- Sends: `{ imageUrl, useColab, colabEndpoint }`
- Receives: `{ probability, is_germinated, confidence, model }`

---

### API Routes

#### `app/api/analyze-germination/route.ts`

**Location:** `app/api/analyze-germination/route.ts`  
**Method:** POST  
**Purpose:** Main endpoint for germination analysis

**Request Body:**
\`\`\`typescript
{
  imageUrl: string,           // URL of uploaded image
  useColab: boolean,          // Whether to use Colab model
  colabEndpoint?: string      // ngrok URL if useColab=true
}
\`\`\`

**Response:**
\`\`\`typescript
{
  probability: number,        // 0.0 to 1.0
  is_germinated: boolean,     // true if >= 0.5
  confidence: number,         // Same as probability
  model: string              // "GerminationNet-ResNet18" or "Demo"
}
\`\`\`

**Logic Flow:**

1. **If useColab = true:**
   \`\`\`typescript
   // Call your Colab model
   const result = await predictWithGerminationNet(imageUrl, colabEndpoint)
   return result
   \`\`\`

2. **If useColab = false:**
   \`\`\`typescript
   // Return demo data
   return {
     probability: 0.87,
     is_germinated: true,
     confidence: 0.87,
     model: "Demo"
   }
   \`\`\`

**Error Handling:**
- Returns 400 for missing imageUrl
- Returns 500 for analysis failures
- Falls back to demo data if Colab fails

---

#### `app/api/analytics/dashboard/route.ts`

**Location:** `app/api/analytics/dashboard/route.ts`  
**Method:** GET  
**Purpose:** Fetch dashboard statistics

**Response:**
\`\`\`typescript
{
  totalRecords: number,        // Count of germination_records
  activeGrowing: number,       // Records with current_stage = 'sprouting'
  totalPhotos: number,         // Count of photo_records
  successRate: number         // % of germinated records
}
\`\`\`

**Database Queries:**
\`\`\`sql
-- Total records
SELECT COUNT(*) FROM germination_records

-- Active growing
SELECT COUNT(*) FROM germination_records 
WHERE current_stage = 'sprouting'

-- Total photos
SELECT COUNT(*) FROM photo_records

-- Success rate calculation
SELECT AVG(CASE WHEN ... THEN 100 ELSE 0 END) as rate
FROM germination_records
\`\`\`

---

#### `app/api/upload-photo/route.ts`

**Location:** `app/api/upload-photo/route.ts`  
**Method:** POST  
**Purpose:** Upload images to Vercel Blob storage

**Request:**
- FormData with file upload
- Supports JPG, PNG

**Response:**
\`\`\`typescript
{
  url: string,                // Public Blob URL
  pathname: string,           // Blob pathname
  contentType: string        // MIME type
}
\`\`\`

**Implementation:**
\`\`\`typescript
import { put } from '@vercel/blob'

const blob = await put(file.name, file, {
  access: 'public',
})

return { url: blob.url }
\`\`\`

---

#### `app/api/germination/create/route.ts`

**Location:** `app/api/germination/create/route.ts`  
**Method:** POST  
**Purpose:** Create new germination tracking record

**Request Body:**
\`\`\`typescript
{
  seed_type: string,                  // e.g., "Basil", "Arugula"
  planting_date: string,              // ISO date
  expected_germination_days: number   // e.g., 7
}
\`\`\`

**Database Operation:**
\`\`\`sql
INSERT INTO germination_records 
  (seed_type, planting_date, expected_germination_days, current_stage)
VALUES 
  ($1, $2, $3, 'planting')
RETURNING *
\`\`\`

**Response:**
\`\`\`typescript
{
  id: string,                 // UUID of new record
  created_at: string,         // Timestamp
  ...all other fields
}
\`\`\`

---

### Library Files

#### `lib/supabase.ts` - Database Client

**Location:** `lib/supabase.ts`  
**Purpose:** Supabase client configuration

**Client Types:**

1. **Browser Client (Client Components)**
\`\`\`typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
\`\`\`

2. **Server Client (API Routes)**
\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
\`\`\`

**When to use which:**
- Use `supabase` in React components
- Use `createServerClient()` in API routes for full access

---

#### `lib/germination-net.ts` - Colab Model API

**Location:** `lib/germination-net.ts`  
**Purpose:** Interface with your PyTorch model in Colab

**Main Function:**
\`\`\`typescript
export async function predictWithGerminationNet(
  imageUrl: string,
  colabEndpoint: string
): Promise<GerminationPrediction>
\`\`\`

**How it works:**
1. Sends POST request to your ngrok URL
2. Request body: `{ image_url: imageUrl }`
3. Receives: `{ probability: 0.87 }`
4. Threshold: >= 0.5 means germinated

**Health Check:**
\`\`\`typescript
export async function testGerminationNetEndpoint(
  endpoint: string
): Promise<boolean>
\`\`\`

Tries to access `endpoint/health` to verify Colab is running

---

#### `lib/types.ts` - TypeScript Definitions

**Location:** `lib/types.ts`  
**Purpose:** Shared type definitions

**Key Types:**

\`\`\`typescript
export interface GerminationRecord {
  id: string
  seed_type: string
  user_id?: string
  planting_date: string
  expected_germination_days: number
  current_stage: string
  created_at: string
  updated_at: string
  notes?: string
}

export interface PhotoRecord {
  id: string
  germination_record_id: string
  photo_url: string
  day_number: number
  ai_analysis: string
  ai_model_used: string
  uploaded_at: string
}

export interface GerminationProgress {
  id: string
  germination_record_id: string
  day_number: number
  actual_germination_rate: number
  environmental_conditions: EnvironmentalConditions
  growth_stage: string
  recorded_at: string
  notes?: string
  photo_url?: string
}

export interface EnvironmentalConditions {
  temperature: number
  humidity: number
  light_hours: number
}
\`\`\`

---

### Scripts

#### `scripts/germination-net-server.py` - Colab Server

**Location:** `scripts/germination-net-server.py`  
**Purpose:** Flask API server for your PyTorch model

**How to use in Colab:**

\`\`\`python
# 1. Install dependencies
!pip install flask flask-cors pyngrok torch torchvision

# 2. Mount Google Drive (if model is there)
from google.colab import drive
drive.mount('/content/drive')

# 3. Copy this script to a cell and run

# 4. Get ngrok token from ngrok.com
!ngrok authtoken YOUR_TOKEN_HERE

# 5. Model will start and print public URL
\`\`\`

**Key Endpoints:**

1. **POST /predict**
   - Input: `{ "image_url": "https://..." }`
   - Output: `{ "probability": 0.87, "is_germinated": true }`

2. **GET /health**
   - Returns: `{ "status": "healthy" }`
   - Used for connection testing

**Model Loading:**
\`\`\`python
# Load your trained model
model = torch.load('/path/to/germination_model.pth')
model.eval()
\`\`\`

**Image Processing:**
\`\`\`python
# Standard ImageNet preprocessing
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                       std=[0.229, 0.224, 0.225])
])
\`\`\`

---

## Database Architecture

### Database: Supabase (PostgreSQL)

**Connection:** Managed via environment variables

### Table Schemas

#### 1. `users` Table

**Purpose:** User management and authentication

\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Row Level Security (RLS):**
- Users can view own profile
- Users can update own profile
- Admins can view all users
- Admins can update user roles

---

#### 2. `germination_records` Table

**Purpose:** Track each germination experiment

\`\`\`sql
CREATE TABLE germination_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  seed_type TEXT NOT NULL,
  planting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_germination_days INTEGER,
  current_stage TEXT DEFAULT 'planting',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Columns Explained:**
- `seed_type`: What you're growing (e.g., "Basil", "Arugula")
- `planting_date`: When seeds were planted
- `expected_germination_days`: How many days until germination expected
- `current_stage`: Current growth phase (planting, sprouting, growing, harvested)

**RLS:**
- Users can only see their own records

---

#### 3. `photo_records` Table

**Purpose:** Store all uploaded photos and AI analysis

\`\`\`sql
CREATE TABLE photo_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  germination_record_id UUID REFERENCES germination_records(id),
  photo_url TEXT NOT NULL,
  day_number INTEGER,
  ai_analysis TEXT,
  ai_model_used TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Columns Explained:**
- `photo_url`: Vercel Blob URL of the image
- `day_number`: Days since planting
- `ai_analysis`: JSON string with analysis results
- `ai_model_used`: Which AI analyzed it ("GerminationNet-ResNet18", "Demo")

**RLS:**
- Users can only see photos of their own records

---

#### 4. `germination_progress` Table

**Purpose:** Track daily progress and environmental data

\`\`\`sql
CREATE TABLE germination_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  germination_record_id UUID REFERENCES germination_records(id),
  day_number INTEGER NOT NULL,
  actual_germination_rate NUMERIC,
  environmental_conditions JSONB,
  growth_stage VARCHAR,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  photo_url TEXT
);
\`\`\`

**Columns Explained:**
- `actual_germination_rate`: Percentage of seeds that germinated
- `environmental_conditions`: JSON with temperature, humidity, light_hours
- `growth_stage`: Current phase

**Example JSONB:**
\`\`\`json
{
  "temperature": 21,
  "humidity": 75,
  "light_hours": 12
}
\`\`\`

---

## API Endpoints

### Complete API Reference

#### Authentication Endpoints
Currently not implemented, all endpoints are public for POC.

#### Analysis Endpoints

**POST /api/analyze-germination**
- Analyze image with GerminationNet or demo data
- Body: `{ imageUrl, useColab, colabEndpoint }`
- Returns: `{ probability, is_germinated, confidence, model }`

**POST /api/analyze-photo**
- Alternative analysis endpoint (currently not used)
- Body: `{ imageUrl }`
- Returns analysis object

#### Upload Endpoints

**POST /api/upload-photo**
- Upload image to Vercel Blob
- Body: FormData with file
- Returns: `{ url }`

#### CRUD Endpoints

**POST /api/germination/create**
- Create new tracking record
- Body: `{ seed_type, planting_date, expected_germination_days }`
- Returns: Created record

**GET /api/germination/list**
- List all user records
- Query params: `?user_id=xxx`
- Returns: Array of records

**PUT /api/germination/update**
- Update existing record
- Body: `{ id, ...updates }`
- Returns: Updated record

#### Analytics Endpoints

**GET /api/analytics/dashboard**
- Get dashboard statistics
- No params required
- Returns: `{ totalRecords, activeGrowing, totalPhotos, successRate }`

---

## AI Model Integration

### Your Custom GerminationNet Model

**Architecture:** ResNet18 (PyTorch)  
**Task:** Binary classification  
**Output:** Probability score 0.0 to 1.0  
**Threshold:** >= 0.5 = germinated

### How Integration Works

\`\`\`
Dashboard → Upload Image → Vercel Blob
           ↓
      Get image URL
           ↓
    POST to /api/analyze-germination
           ↓
    Check if useColab = true
           ↓
    YES → Call Colab model via ngrok
    NO  → Return demo data
           ↓
    Display results to user
\`\`\`

### Colab Setup Process

**Step 1: Start Flask Server**
\`\`\`python
# In your Colab notebook
from flask import Flask, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import requests
from io import BytesIO

app = Flask(__name__)

# Load your model
model = torch.load('path/to/model.pth')
model.eval()
\`\`\`

**Step 2: Create Prediction Endpoint**
\`\`\`python
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    image_url = data['image_url']
    
    # Download image
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content))
    
    # Preprocess
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], 
                           [0.229, 0.224, 0.225])
    ])
    
    img_tensor = transform(image).unsqueeze(0)
    
    # Predict
    with torch.no_grad():
        output = model(img_tensor)
        probability = torch.sigmoid(output).item()
    
    return jsonify({
        'probability': probability,
        'is_germinated': probability >= 0.5
    })
\`\`\`

**Step 3: Expose with ngrok**
\`\`\`python
from pyngrok import ngrok

# Get token from ngrok.com
ngrok.set_auth_token("YOUR_TOKEN")

# Start tunnel
public_url = ngrok.connect(5000)
print(f"Model URL: {public_url}/predict")

# Run Flask
app.run(port=5000)
\`\`\`

**Step 4: Use in Dashboard**
1. Copy the ngrok URL (e.g., `https://abc123.ngrok.io/predict`)
2. Go to `/analyze` page
3. Enable "Use Colab Model"
4. Paste URL
5. Upload image and analyze

---

## Data Flow

### Complete User Journey

**1. Homepage Visit**
\`\`\`
User opens / 
  → Layout renders (fonts, metadata)
  → page.tsx loads
  → useEffect fetches /api/analytics/dashboard
  → Stats populate
  → User sees dashboard
\`\`\`

**2. Navigate to Analysis**
\`\`\`
User clicks "Analyze Photo with AI"
  → Router navigates to /analyze
  → TrayGerminationDetector component loads
  → Settings section shows (Colab endpoint input)
  → Upload interface ready
\`\`\`

**3. Upload and Analyze**
\`\`\`
User drops image
  → File saved to state
  → Preview shown
  → User clicks "Analyze Germination"
  
  → handleAnalysis() executes:
     1. Upload to Blob:
        POST /api/upload-photo
        → Returns image URL
     
     2. Analyze image:
        POST /api/analyze-germination
        Body: { imageUrl, useColab, colabEndpoint }
        
        → If useColab:
           → Call predictWithGerminationNet()
           → POST to ngrok URL
           → Your model processes image
           → Returns probability
        
        → If !useColab:
           → Return demo data
     
     3. Display results:
        → Show probability
        → Show confidence
        → Show model badge
\`\`\`

**4. Results Display**
\`\`\`
Analysis complete
  → Results card appears
  → Shows:
     - Germination probability (87%)
     - Is germinated (Yes/No)
     - Confidence score
     - Model used (GerminationNet or Demo)
\`\`\`

---

## Setup Instructions

### Prerequisites

1. Vercel account (for deployment)
2. Supabase project (for database)
3. Google Colab (optional, for custom model)
4. ngrok account (optional, for custom model)

### Local Development

**1. Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd microgreen-germination-tracker
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

**3. Set up environment variables**

Already configured in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `DRIVE_FOLDER_ID`

**4. Run development server**
\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000

### Deployment

**Automatic via Vercel:**
1. Push to GitHub
2. Vercel auto-deploys
3. Environment variables already set
4. Database already connected

### Colab Model Setup (Optional)

**1. Open Colab notebook**

**2. Install dependencies**
\`\`\`python
!pip install flask flask-cors pyngrok torch torchvision pillow
\`\`\`

**3. Load your model**
\`\`\`python
model = torch.load('/path/to/your/model.pth')
model.eval()
\`\`\`

**4. Copy server code from scripts/germination-net-server.py**

**5. Start server with ngrok**
\`\`\`python
!ngrok authtoken YOUR_TOKEN
\`\`\`

**6. Copy the ngrok URL**

**7. In dashboard, enable Colab and paste URL**

---

## Troubleshooting

### Image won't upload
- Check file size (< 10MB)
- Use JPG or PNG only
- Verify BLOB_READ_WRITE_TOKEN is set

### Colab model not responding
- Check Colab cell is running
- Verify ngrok tunnel is active
- Test with `/health` endpoint
- System will use demo data automatically

### Database errors
- Verify Supabase integration is connected
- Check environment variables are set
- Look at RLS policies if queries fail

### Stats showing zero
- Create some germination records first
- Check `/api/analytics/dashboard` directly
- Verify database has data

---

## Summary

This dashboard has **2 pages** and uses either your **custom PyTorch model** or **demo data** for analysis:

1. **Homepage (/)** - Shows stats and quick actions
2. **Analyze (/analyze)** - Upload photos, get AI analysis

The system connects your ResNet18 model running in Google Colab via ngrok, or falls back to demo data when Colab isn't connected. All data is stored in Supabase, images in Vercel Blob.

---

**For questions or updates, see README.md or the docs/ folder.**
