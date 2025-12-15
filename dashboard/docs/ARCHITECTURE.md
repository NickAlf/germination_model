# Microgreens Check - System Architecture Documentation

## Overview
This document provides high-level architecture diagrams for the Microgreens Check germination detection system, suitable for thesis documentation and technical presentations.

---

## 1. System Overview Architecture

\`\`\`mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend<br/>React + TypeScript]
        A1[Dashboard UI]
        A2[AI Analysis Interface]
        A3[Tracker Components]
    end
    
    subgraph "Application Layer"
        B[Next.js API Routes]
        B1[/api/analyze-germination]
        B2[/api/germination/*]
        B3[/api/upload-photo]
        B4[/api/analytics/*]
    end
    
    subgraph "AI/ML Layer"
        C[GerminationNet Model<br/>ResNet18 PyTorch]
        D[ChatGPT API<br/>Fallback Analysis]
        E[Google Drive<br/>Image Storage]
    end
    
    subgraph "Data Layer"
        F[(Supabase PostgreSQL<br/>Database)]
        G[Vercel Blob<br/>Image Storage]
    end
    
    subgraph "External Services"
        H[Google Colab<br/>Model Hosting]
        I[ngrok Tunnel<br/>API Endpoint]
    end
    
    A --> B
    A1 --> B4
    A2 --> B1
    A3 --> B2
    
    B1 --> C
    B1 --> D
    B1 --> E
    B2 --> F
    B3 --> G
    B4 --> F
    
    C --> H
    H --> I
    I --> B1
    
    style C fill:#4CAF50
    style D fill:#FF9800
    style F fill:#2196F3
    style H fill:#9C27B0
\`\`\`

---

## 2. AI Analysis Data Flow

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant GerminationNet
    participant ChatGPT
    participant Database
    participant BlobStorage
    
    User->>Frontend: Upload seed tray image
    Frontend->>API: POST /api/analyze-germination
    API->>BlobStorage: Store image
    BlobStorage-->>API: Return image URL
    
    alt GerminationNet Available
        API->>GerminationNet: Send image for analysis
        GerminationNet->>GerminationNet: ResNet18 inference
        GerminationNet-->>API: Return prediction<br/>(germinated/not germinated)
    else GerminationNet Unavailable
        API->>ChatGPT: Fallback to ChatGPT
        ChatGPT-->>API: Return AI analysis
    end
    
    API->>Database: Store analysis results
    Database-->>API: Confirm storage
    API-->>Frontend: Return results + confidence
    Frontend-->>User: Display germination analysis
\`\`\`

---

## 3. Database Schema Architecture

\`\`\`mermaid
erDiagram
    USERS ||--o{ GERMINATION_RECORDS : creates
    GERMINATION_RECORDS ||--o{ PHOTO_RECORDS : contains
    GERMINATION_RECORDS ||--o{ GERMINATION_PROGRESS : tracks
    
    USERS {
        uuid id PK
        text email
        text name
        text role
        timestamp created_at
    }
    
    GERMINATION_RECORDS {
        uuid id PK
        uuid user_id FK
        text seed_type
        timestamp planting_date
        integer expected_germination_days
        text current_stage
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    PHOTO_RECORDS {
        uuid id PK
        uuid germination_record_id FK
        text photo_url
        integer day_number
        text ai_model_used
        text ai_analysis
        timestamp uploaded_at
    }
    
    GERMINATION_PROGRESS {
        uuid id PK
        uuid germination_record_id FK
        integer day_number
        numeric actual_germination_rate
        jsonb environmental_conditions
        text growth_stage
        text photo_url
        text notes
        timestamp recorded_at
        timestamp created_at
    }
\`\`\`

---

## 4. GerminationNet Model Architecture

\`\`\`mermaid
graph LR
    subgraph "Input Layer"
        A[Seed Tray Image<br/>224x224 RGB]
    end
    
    subgraph "Feature Extraction<br/>ResNet18 Backbone"
        B[Conv Layer 1<br/>64 filters]
        C[Residual Block 1<br/>64 channels]
        D[Residual Block 2<br/>128 channels]
        E[Residual Block 3<br/>256 channels]
        F[Residual Block 4<br/>512 channels]
    end
    
    subgraph "Classification Head"
        G[Global Average Pooling]
        H[Fully Connected<br/>512 → 256]
        I[Dropout 0.5]
        J[Fully Connected<br/>256 → 1]
        K[Sigmoid Activation]
    end
    
    subgraph "Output"
        L[Binary Classification<br/>Germinated: 0/1<br/>+ Confidence Score]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    
    style A fill:#E3F2FD
    style L fill:#C8E6C9
    style F fill:#FFF9C4
\`\`\`

---

## 5. Authentication & Security Flow

\`\`\`mermaid
flowchart TD
    A[User Access] --> B{Authenticated?}
    B -->|No| C[Redirect to Login]
    C --> D[Supabase Auth]
    D --> E{Valid Credentials?}
    E -->|Yes| F[Create Session]
    E -->|No| C
    
    B -->|Yes| G[Access Dashboard]
    F --> G
    
    G --> H{Action Type}
    H -->|View Records| I[Check RLS Policy]
    H -->|Upload Photo| J[Check User Ownership]
    H -->|AI Analysis| K[Rate Limit Check]
    
    I --> L{Policy Pass?}
    J --> L
    K --> L
    
    L -->|Yes| M[Execute Action]
    L -->|No| N[Return 403 Error]
    
    M --> O[Return Results]
    
    style D fill:#4CAF50
    style I fill:#2196F3
    style M fill:#8BC34A
    style N fill:#F44336
\`\`\`

---

## 6. Deployment Architecture

\`\`\`mermaid
graph TB
    subgraph "Development"
        A[Local Development<br/>Next.js Dev Server]
        B[Google Colab<br/>Model Training/Testing]
    end
    
    subgraph "Version Control"
        C[GitHub Repository<br/>Source Code]
    end
    
    subgraph "CI/CD"
        D[Vercel Platform<br/>Auto Deploy]
    end
    
    subgraph "Production Environment"
        E[Vercel Edge Network<br/>CDN Distribution]
        F[Next.js App<br/>Server-Side Rendering]
        G[API Routes<br/>Serverless Functions]
    end
    
    subgraph "Data Services"
        H[(Supabase<br/>PostgreSQL Database)]
        I[Vercel Blob<br/>File Storage]
        J[Google Drive<br/>Dataset Storage]
    end
    
    subgraph "AI Services"
        K[Google Colab + ngrok<br/>GerminationNet API]
        L[OpenAI API<br/>ChatGPT Fallback]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    
    G --> H
    G --> I
    G --> J
    G --> K
    G --> L
    
    style E fill:#000000,color:#fff
    style K fill:#F9AB00
    style H fill:#3ECF8E
\`\`\`

---

## 7. Component Interaction Map

\`\`\`mermaid
graph TD
    subgraph "User Interface Components"
        A[Dashboard Page<br/>Stats & Overview]
        B[AI Analysis Page<br/>Image Upload]
        C[Tracker Page<br/>Record Management]
        D[Dataset Page<br/>Data Explorer]
    end
    
    subgraph "Shared Components"
        E[Photo Upload Component]
        F[Germination Chart]
        G[Tray Detector]
        H[Navigation]
    end
    
    subgraph "API Layer"
        I[analyze-germination API]
        J[germination CRUD APIs]
        K[analytics APIs]
        L[upload-photo API]
    end
    
    subgraph "Data Services"
        M[Supabase Client]
        N[GerminationNet Client]
        O[Google Drive Client]
    end
    
    A --> H
    A --> K
    B --> H
    B --> E
    B --> G
    C --> H
    C --> J
    D --> H
    
    E --> I
    E --> L
    G --> I
    
    I --> N
    I --> M
    J --> M
    K --> M
    L --> M
    
    N --> O
    
    style A fill:#E8F5E9
    style B fill:#E3F2FD
    style C fill:#FFF3E0
    style D fill:#F3E5F5
\`\`\`

---

## 8. Technology Stack Overview

\`\`\`mermaid
mindmap
  root((Microgreens<br/>Check System))
    Frontend
      Next.js 14
      React 18
      TypeScript
      Tailwind CSS
      shadcn/ui Components
    Backend
      Next.js API Routes
      Serverless Functions
      Supabase Client
    AI/ML
      PyTorch
      ResNet18
      OpenAI GPT
      Google Colab
      Flask API
    Database
      PostgreSQL
      Supabase
      Row Level Security
    Storage
      Vercel Blob
      Google Drive API
    DevOps
      GitHub
      Vercel Deployment
      ngrok Tunneling
    Authentication
      Supabase Auth
      JWT Tokens
      Session Management
\`\`\`

---

## Key Architectural Decisions

### 1. **Dual AI System**
- **Primary**: Custom GerminationNet (ResNet18) for specialized seed detection
- **Fallback**: ChatGPT API ensures 100% uptime for proof-of-concept
- **Rationale**: Demonstrates both custom ML and production reliability

### 2. **Serverless Architecture**
- Next.js API Routes deployed as Vercel serverless functions
- Auto-scaling and zero infrastructure management
- Cost-effective for academic project

### 3. **Row-Level Security (RLS)**
- Supabase RLS policies ensure data isolation
- Users can only access their own germination records
- Admin role for research oversight

### 4. **Hybrid Storage Strategy**
- **Vercel Blob**: Production image storage (fast CDN)
- **Google Drive**: Research dataset and model artifacts
- **Rationale**: Balance between performance and academic data management

### 5. **Real-time Model Integration**
- Google Colab hosts model via Flask + ngrok
- Enables rapid iteration during thesis development
- Production deployment can migrate to permanent hosting

---

## Performance Characteristics

| Component | Metric | Target |
|-----------|--------|--------|
| Image Upload | Time to store | < 2s |
| AI Analysis (GerminationNet) | Inference time | < 1s |
| AI Analysis (ChatGPT) | Response time | < 5s |
| Dashboard Load | Time to interactive | < 1.5s |
| Database Query | Average response | < 100ms |

---

## Security Measures

1. **Authentication**: Supabase Auth with JWT tokens
2. **Authorization**: Row-level security policies
3. **Data Validation**: Zod schema validation on all inputs
4. **API Security**: Rate limiting on analysis endpoints
5. **Image Storage**: Signed URLs with expiration
6. **Environment Variables**: Secure secret management via Vercel

---

## Scalability Considerations

- **Horizontal Scaling**: Serverless functions auto-scale
- **Database**: Supabase connection pooling handles concurrent users
- **CDN**: Vercel Edge Network for global distribution
- **Caching**: SWR for client-side data caching
- **Model Serving**: Can migrate from Colab to dedicated GPU instances

---

*Last Updated: December 2024*
*Version: 1.0 - Proof of Concept Architecture*
