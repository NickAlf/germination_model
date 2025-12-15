# Additional Mermaid Architecture Diagrams

## 1. User Journey Flow

\`\`\`mermaid
flowchart TD
    Start([User Opens App]) --> Login{Logged In?}
    Login -->|No| Auth[Sign In/Sign Up]
    Auth --> Dashboard
    Login -->|Yes| Dashboard[View Dashboard]
    
    Dashboard --> Action{Select Action}
    
    Action -->|Track| NewRecord[Start New Record]
    NewRecord --> EnterDetails[Enter Seed Details]
    EnterDetails --> SaveRecord[Save to Database]
    SaveRecord --> TrackView[View Tracker]
    
    Action -->|Analyze| Upload[Upload Photo]
    Upload --> SelectModel{Choose Model}
    SelectModel -->|GerminationNet| ColabAnalysis[Colab Model Analysis]
    SelectModel -->|ChatGPT| GPTAnalysis[ChatGPT Analysis]
    ColabAnalysis --> Results[View Results]
    GPTAnalysis --> Results
    Results --> SaveAnalysis[Save to Record]
    
    Action -->|View| ViewRecords[Browse Records]
    ViewRecords --> RecordDetail[View Record Details]
    RecordDetail --> Charts[View Progress Charts]
    
    Action -->|Dataset| ExploreData[Explore Dataset]
    ExploreData --> Statistics[View Statistics]
    
    SaveAnalysis --> End([Continue Tracking])
    Charts --> End
    Statistics --> End
    TrackView --> End
    
    style Dashboard fill:#4CAF50,color:#fff
    style ColabAnalysis fill:#FF9800,color:#fff
    style Results fill:#2196F3,color:#fff
    style End fill:#9C27B0,color:#fff
\`\`\`

---

## 2. Image Processing Pipeline

\`\`\`mermaid
flowchart LR
    subgraph "Client Side"
        A[User Selects Image] --> B[Preview Image]
        B --> C[Validate Format/Size]
    end
    
    subgraph "Upload Processing"
        C --> D{Valid?}
        D -->|No| E[Show Error]
        D -->|Yes| F[Convert to Base64]
        F --> G[Send to API]
    end
    
    subgraph "Storage Layer"
        G --> H[Vercel Blob Upload]
        H --> I[Generate Public URL]
    end
    
    subgraph "AI Processing"
        I --> J{Model Selection}
        J -->|Colab| K[Resize to 224x224]
        J -->|ChatGPT| L[Keep Original]
        
        K --> M[Normalize Pixels]
        M --> N[Send to Flask API]
        N --> O[PyTorch Inference]
        O --> P[Get Prediction]
        
        L --> Q[Encode for GPT]
        Q --> R[Send to OpenAI]
        R --> S[Get Analysis]
    end
    
    subgraph "Result Processing"
        P --> T[Format Results]
        S --> T
        T --> U[Calculate Metrics]
        U --> V[Save to Database]
        V --> W[Return to Client]
    end
    
    style A fill:#E3F2FD
    style O fill:#4CAF50
    style R fill:#FF9800
    style W fill:#C8E6C9
\`\`\`

---

## 3. API Route Architecture

\`\`\`mermaid
graph TB
    subgraph "API Routes Structure"
        A[/api]
        
        A --> B[/analyze-germination<br/>POST - AI Analysis]
        A --> C[/germination]
        A --> D[/analytics]
        A --> E[/upload-photo<br/>POST - Image Upload]
        A --> F[/model-performance<br/>GET - Model Stats]
        
        C --> C1[/create<br/>POST - New Record]
        C --> C2[/list<br/>GET - List All]
        C --> C3[/update<br/>PUT - Update Record]
        C --> C4[/[id]<br/>GET - Single Record]
        
        D --> D1[/dashboard<br/>GET - Stats Summary]
        D --> D2[/progress<br/>GET - Time Series]
    end
    
    subgraph "External Dependencies"
        G[(Supabase Database)]
        H[Vercel Blob Storage]
        I[GerminationNet API]
        J[OpenAI API]
    end
    
    B --> I
    B --> J
    B --> G
    C1 --> G
    C2 --> G
    C3 --> G
    C4 --> G
    D1 --> G
    D2 --> G
    E --> H
    E --> G
    
    style B fill:#FF9800
    style E fill:#2196F3
    style G fill:#4CAF50
    style I fill:#9C27B0
\`\`\`

---

## 4. Real-time Data Synchronization

\`\`\`mermaid
sequenceDiagram
    participant User
    participant React Component
    participant SWR Cache
    participant API Route
    participant Supabase
    
    User->>React Component: Open Dashboard
    React Component->>SWR Cache: Check cached data
    
    alt Cache Hit
        SWR Cache-->>React Component: Return cached data
        React Component-->>User: Display data instantly
        SWR Cache->>API Route: Revalidate in background
    else Cache Miss
        React Component->>API Route: Fetch fresh data
    end
    
    API Route->>Supabase: Query database
    Supabase-->>API Route: Return results
    API Route-->>SWR Cache: Update cache
    SWR Cache-->>React Component: Update UI
    React Component-->>User: Show latest data
    
    Note over User,Supabase: User makes changes
    User->>React Component: Upload new photo
    React Component->>API Route: POST /analyze-germination
    API Route->>Supabase: Insert new record
    Supabase-->>API Route: Confirm insert
    API Route-->>React Component: Return success
    React Component->>SWR Cache: Mutate cache
    SWR Cache-->>React Component: Trigger re-render
    React Component-->>User: Update UI
\`\`\`

---

## 5. Database Query Optimization

\`\`\`mermaid
flowchart TD
    A[Client Request] --> B{Query Type}
    
    B -->|Simple Lookup| C[Direct Query]
    C --> C1[(SELECT * FROM records<br/>WHERE id = ?)]
    
    B -->|List View| D[Paginated Query]
    D --> D1[(SELECT * FROM records<br/>LIMIT 20 OFFSET ?)]
    
    B -->|Analytics| E[Aggregation Query]
    E --> E1[(SELECT COUNT, AVG<br/>GROUP BY seed_type)]
    
    B -->|Time Series| F[Date Range Query]
    F --> F1[(SELECT * FROM progress<br/>WHERE date BETWEEN ? AND ?)]
    
    C1 --> G[Apply RLS Policy]
    D1 --> G
    E1 --> G
    F1 --> G
    
    G --> H{User Authorized?}
    H -->|Yes| I[Return Results]
    H -->|No| J[Return 403]
    
    I --> K[Cache in SWR]
    K --> L[Render UI]
    
    style G fill:#FF9800
    style H fill:#F44336,color:#fff
    style K fill:#4CAF50
\`\`\`

---

## 6. Error Handling Strategy

\`\`\`mermaid
flowchart TD
    A[API Request] --> B{Try Operation}
    
    B -->|Success| C[Return Success Response]
    
    B -->|Error| D{Error Type}
    
    D -->|Network Error| E[Retry 3 times]
    E --> E1{Success?}
    E1 -->|Yes| C
    E1 -->|No| F[Show Offline Message]
    
    D -->|Auth Error| G[Redirect to Login]
    
    D -->|Validation Error| H[Show Form Errors]
    
    D -->|AI Model Error| I{Using Colab?}
    I -->|Yes| J[Fallback to ChatGPT]
    I -->|No| K[Show Error + Retry]
    
    J --> L{ChatGPT Success?}
    L -->|Yes| C
    L -->|No| K
    
    D -->|Database Error| M[Log to Console]
    M --> N[Show Generic Error]
    
    D -->|Rate Limit| O[Show Cooldown Timer]
    
    style C fill:#4CAF50,color:#fff
    style F fill:#F44336,color:#fff
    style J fill:#FF9800,color:#fff
    style N fill:#9E9E9E,color:#fff
\`\`\`

---

## 7. State Management Flow

\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> Uploading: User selects image
    Uploading --> Analyzing: Upload complete
    Uploading --> Error: Upload failed
    
    Analyzing --> Processing: Send to model
    Processing --> Completed: Analysis success
    Processing --> Error: Analysis failed
    
    Error --> Idle: User dismisses error
    Error --> Analyzing: User retries
    
    Completed --> Saving: User saves results
    Saving --> Saved: Save success
    Saving --> Error: Save failed
    
    Saved --> Idle: Return to dashboard
    
    note right of Processing
        GerminationNet or
        ChatGPT processing
    end note
    
    note right of Saved
        Data persisted to
        Supabase
    end note
\`\`\`

---

## 8. Colab Integration Architecture

\`\`\`mermaid
flowchart TB
    subgraph "Google Colab Notebook"
        A[Load GerminationNet Model<br/>ResNet18 + Weights]
        A --> B[Start Flask Server<br/>Port 5000]
        B --> C[Initialize ngrok Tunnel]
        C --> D[Generate Public URL<br/>https://xxx.ngrok.io]
    end
    
    subgraph "Dashboard Settings"
        E[User Enters ngrok URL]
        E --> F[Test Connection<br/>/health endpoint]
        F --> G{Connection OK?}
        G -->|Yes| H[Save Endpoint<br/>localStorage]
        G -->|No| I[Show Error Message]
    end
    
    subgraph "Analysis Request"
        J[User Uploads Image]
        J --> K[Read Endpoint from Settings]
        K --> L[POST /predict]
        L --> M{Endpoint Reachable?}
        M -->|Yes| N[GerminationNet Response]
        M -->|No| O[Fallback to ChatGPT]
    end
    
    D --> F
    H --> K
    
    style D fill:#F9AB00
    style N fill:#4CAF50,color:#fff
    style O fill:#FF9800,color:#fff
\`\`\`

---

## 9. Component Lifecycle

\`\`\`mermaid
sequenceDiagram
    participant Browser
    participant Next.js
    participant Component
    participant API
    participant Database
    
    Browser->>Next.js: Navigate to /dashboard
    Next.js->>Component: Server-side render (SSR)
    Component->>API: Fetch initial data
    API->>Database: Query records
    Database-->>API: Return data
    API-->>Component: Send data
    Component-->>Next.js: Render HTML
    Next.js-->>Browser: Send page
    
    Note over Browser,Component: Client-side Hydration
    
    Browser->>Component: React hydration
    Component->>Component: Setup SWR hooks
    Component->>API: Revalidate data
    API->>Database: Fresh query
    Database-->>API: Latest data
    API-->>Component: Update
    Component-->>Browser: Re-render
    
    Note over Browser,Database: User Interaction
    
    Browser->>Component: User clicks analyze
    Component->>API: POST /analyze-germination
    API->>API: Process with AI
    API->>Database: Save results
    Database-->>API: Confirm save
    API-->>Component: Return results
    Component->>Component: Mutate SWR cache
    Component-->>Browser: Update UI
\`\`\`

---

## 10. Performance Optimization Strategy

\`\`\`mermaid
mindmap
  root((Performance<br/>Optimization))
    Frontend
      Code Splitting
        Dynamic imports
        Route-based chunks
      Image Optimization
        Next.js Image component
        Lazy loading
        WebP format
      Caching
        SWR revalidation
        Browser cache
        Service worker
    Backend
      API Routes
        Edge runtime
        Streaming responses
        Compression
      Database
        Connection pooling
        Query optimization
        Indexes on keys
      Storage
        CDN delivery
        Signed URLs
        Blob caching
    AI/ML
      Model Optimization
        Quantization
        ONNX conversion
        Batch inference
      Request Batching
        Queue system
        Debouncing
        Rate limiting
\`\`\`

---

## 11. Security Architecture

\`\`\`mermaid
graph TD
    subgraph "Client Security"
        A[HTTPS Only]
        B[Content Security Policy]
        C[XSS Protection]
    end
    
    subgraph "Authentication Layer"
        D[Supabase Auth]
        E[JWT Tokens]
        F[Refresh Tokens]
        G[Session Management]
    end
    
    subgraph "Authorization Layer"
        H[Row Level Security]
        I[User Ownership Check]
        J[Role-based Access]
    end
    
    subgraph "API Security"
        K[Input Validation<br/>Zod Schemas]
        L[Rate Limiting]
        M[CORS Policy]
        N[API Key Protection]
    end
    
    subgraph "Data Security"
        O[Encrypted at Rest]
        P[Encrypted in Transit]
        Q[Sanitized Inputs]
        R[Signed URLs]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    E --> F
    F --> G
    
    G --> H
    H --> I
    I --> J
    
    J --> K
    K --> L
    L --> M
    M --> N
    
    N --> O
    O --> P
    P --> Q
    Q --> R
    
    style D fill:#4CAF50,color:#fff
    style H fill:#2196F3,color:#fff
    style K fill:#FF9800,color:#fff
    style O fill:#9C27B0,color:#fff
\`\`\`

---

*These diagrams complement the main architecture documentation and provide detailed views of system workflows, data flows, and interaction patterns.*
