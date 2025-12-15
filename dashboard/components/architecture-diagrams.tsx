"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Network, Workflow, Layers, Database, GitBranch, AlertCircle, Server, ImageIcon } from "lucide-react"

export default function ArchitectureDiagrams() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🏗️ System Architecture Documentation</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive architecture diagrams for the Germination Detection System
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Badge variant="outline">Next.js 15</Badge>
          <Badge variant="outline">YOLO Detection</Badge>
          <Badge variant="outline">Computer Vision</Badge>
          <Badge variant="outline">Supabase</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
          <TabsTrigger value="overview" className="text-xs">
            <Network className="w-4 h-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="text-xs">
            <Workflow className="w-4 h-4 mr-1" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="red-marker" className="text-xs">
            <ImageIcon className="w-4 h-4 mr-1" />
            Red Marker
          </TabsTrigger>
          <TabsTrigger value="green-analysis" className="text-xs">
            <Layers className="w-4 h-4 mr-1" />
            Green Analysis
          </TabsTrigger>
          <TabsTrigger value="components" className="text-xs">
            <GitBranch className="w-4 h-4 mr-1" />
            Components
          </TabsTrigger>
          <TabsTrigger value="dataflow" className="text-xs">
            <Database className="w-4 h-4 mr-1" />
            Data Flow
          </TabsTrigger>
          <TabsTrigger value="hsv" className="text-xs">
            <FileText className="w-4 h-4 mr-1" />
            HSV Space
          </TabsTrigger>
          <TabsTrigger value="deployment" className="text-xs">
            <Server className="w-4 h-4 mr-1" />
            Deployment
          </TabsTrigger>
          <TabsTrigger value="errors" className="text-xs">
            <AlertCircle className="w-4 h-4 mr-1" />
            Errors
          </TabsTrigger>
        </TabsList>

        {/* Overview Diagram */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture Overview</CardTitle>
              <CardDescription>High-level view of all system components and their interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`graph TB
    subgraph "Client Layer"
        A["Web Browser"]
        B["Image Upload Interface"]
        C["Results Visualization"]
    end
    
    subgraph "Application Layer"
        D["Next.js App Router"]
        E["React Components"]
        F["TrayGerminationDetector"]
    end
    
    subgraph "API Layer"
        G["API Routes"]
        H["/api/analyze-tray-germination"]
        I["/api/export-research-data"]
    end
    
    subgraph "Processing Layer"
        J["Image Processing"]
        K["Red Marker Detection"]
        L["YOLO Model Inference"]
        M["Green Pixel Analysis"]
    end
    
    subgraph "Data Layer"
        N["Supabase Database"]
        O["Blob Storage"]
        P["Analysis Results"]
    end
    
    A --> B
    B --> E
    E --> F
    F --> D
    D --> H
    H --> J
    J --> K
    K --> L
    L --> M
    M --> P
    P --> N
    P --> O
    P --> C
    C --> A
    
    style A fill:#e1f5ff
    style D fill:#fff4e1
    style H fill:#e1ffe1
    style L fill:#ffe1f5
    style N fill:#f5e1ff`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Diagram */}
        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Detection Pipeline Flow</CardTitle>
              <CardDescription>
                Step-by-step process flow from image upload to germination classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`flowchart TD
    Start["Upload Image"] --> Validate["Validate Image Format"]
    Validate --> RedDetect["Step 1: Detect Red Markers"]
    
    RedDetect --> CheckMarkers{"Red Markers Found?"}
    CheckMarkers -->|No| Warning["Show Warning + Use Original"]
    CheckMarkers -->|Yes| CalcLine["Calculate Reference Line"]
    
    Warning --> YOLODetect
    CalcLine --> Mask["Step 2: Mask Area Above Line"]
    Mask --> YOLODetect["Step 3: YOLO Tray Detection"]
    
    YOLODetect --> CheckTrays{"Trays Detected?"}
    CheckTrays -->|No| NoTrays["Return: No Trays Found"]
    CheckTrays -->|Yes| Crop["Step 4: Crop Individual Trays"]
    
    Crop --> HSV["Step 5: Convert to HSV Color Space"]
    HSV --> GreenMask["Create Green Pixel Mask"]
    
    GreenMask --> CalcPercent["Calculate Green Percentage"]
    CalcPercent --> Compare{"Green % > 7%?"}
    
    Compare -->|Yes| Germinated["Classify: GERMINATED"]
    Compare -->|No| NotGerm["Classify: NOT GERMINATED"]
    
    Germinated --> Aggregate
    NotGerm --> Aggregate["Aggregate Results"]
    NoTrays --> End
    
    Aggregate --> Stats["Calculate Statistics"]
    Stats --> Visualize["Generate Visualizations"]
    Visualize --> End["Return Results"]
    
    style Start fill:#e1f5ff
    style RedDetect fill:#ffe1e1
    style YOLODetect fill:#fff4e1
    style GreenMask fill:#e1ffe1
    style Germinated fill:#c8f7c5
    style NotGerm fill:#ffc8c8
    style End fill:#e1f5ff`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Red Marker Detection */}
        <TabsContent value="red-marker">
          <Card>
            <CardHeader>
              <CardTitle>Red Marker Detection Algorithm</CardTitle>
              <CardDescription>Process for detecting and using red reference markers in images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`flowchart LR
    A["Input Image (BGR)"] --> B["Convert to HSV"]
    B --> C["Define Red Range 1 (0-10°)"]
    B --> D["Define Red Range 2 (160-180°)"]
    
    C --> E["Create Mask 1"]
    D --> F["Create Mask 2"]
    
    E --> G["Combine Masks (OR)"]
    F --> G
    
    G --> H["Morphological Close"]
    H --> I["Morphological Open"]
    
    I --> J["Find Contours"]
    J --> K["Filter by Area > 100px"]
    
    K --> L["Sort by Area"]
    L --> M["Select 2 Largest"]
    
    M --> N["Calculate Centroids"]
    N --> O["Return Marker Points"]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style G fill:#ffe1e1
    style I fill:#e1ffe1
    style O fill:#c8f7c5`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Green Pixel Analysis */}
        <TabsContent value="green-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Green Pixel Analysis for Germination</CardTitle>
              <CardDescription>HSV-based color analysis to determine germination status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`flowchart TD
    A["Tray Crop Image"] --> B["Convert BGR to HSV"]
    
    B --> C["Define Green Hue Range"]
    C --> D["Hue: 30-100°"]
    
    B --> E["Define Saturation Range"]
    E --> F["Saturation: 20-255"]
    
    B --> G["Define Value Range"]
    G --> H["Value: 30-255"]
    
    D --> I["Create Color Mask"]
    F --> I
    H --> I
    
    I --> J["Count Green Pixels"]
    J --> K["Count Total Pixels"]
    
    K --> L["Calculate Percentage"]
    L --> M["Green % = (Green Pixels / Total) × 100"]
    
    M --> N{"Percentage > 7%?"}
    N -->|Yes| O["GERMINATED ✓"]
    N -->|No| P["NOT GERMINATED ✗"]
    
    O --> Q["Return Result"]
    P --> Q
    
    style A fill:#e1f5ff
    style I fill:#e1ffe1
    style M fill:#fff4e1
    style O fill:#c8f7c5
    style P fill:#ffc8c8`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Component Interaction */}
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Component Interaction Architecture</CardTitle>
              <CardDescription>How frontend and backend components communicate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`graph TB
    subgraph "Frontend Components"
        UI["TrayGerminationDetector"]
        Upload["Image Upload"]
        Preview["Image Preview"]
        Results["Results Display"]
    end
    
    subgraph "State Management"
        State["React useState"]
        Image["selectedImage"]
        Analysis["analysisResult"]
        Loading["isAnalyzing"]
    end
    
    subgraph "API Communication"
        Fetch["fetch API"]
        Request["POST Request"]
        Response["JSON Response"]
    end
    
    subgraph "Backend Processing"
        API["API Route Handler"]
        Validation["Input Validation"]
        Processing["Image Processing"]
        Model["Detection Model"]
    end
    
    subgraph "Analysis Steps"
        Step1["Red Marker Detection"]
        Step2["Area Masking"]
        Step3["YOLO Detection"]
        Step4["Green Analysis"]
    end
    
    Upload --> Image
    Image --> Preview
    Preview --> UI
    UI --> State
    State --> Fetch
    Fetch --> Request
    Request --> API
    API --> Validation
    Validation --> Processing
    Processing --> Step1
    Step1 --> Step2
    Step2 --> Step3
    Step3 --> Step4
    Step4 --> Model
    Model --> Response
    Response --> Analysis
    Analysis --> Results
    Results --> UI
    
    style UI fill:#e1f5ff
    style API fill:#fff4e1
    style Model fill:#ffe1f5
    style Results fill:#e1ffe1`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Flow */}
        <TabsContent value="dataflow">
          <Card>
            <CardHeader>
              <CardTitle>Data Flow Through System</CardTitle>
              <CardDescription>Sequence diagram showing data movement and processing timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`sequenceDiagram
    participant User
    participant Browser
    participant Component
    participant API
    participant Processor
    participant Model
    participant Database
    
    User->>Browser: Upload Image
    Browser->>Component: Handle File
    Component->>Component: Convert to Base64
    Component->>API: POST /api/analyze-tray-germination
    
    API->>API: Validate Input
    API->>Processor: Process Image
    
    Processor->>Processor: Detect Red Markers
    Processor->>Processor: Mask Above Line
    Processor->>Model: Run YOLO Detection
    Model-->>Processor: Bounding Boxes
    
    Processor->>Processor: Crop Trays
    loop For Each Tray
        Processor->>Processor: Analyze Green Pixels
        Processor->>Processor: Calculate Percentage
        Processor->>Processor: Classify Germination
    end
    
    Processor->>Database: Store Results
    Processor-->>API: Return Analysis
    API-->>Component: JSON Response
    Component->>Browser: Update UI
    Browser->>User: Display Results
    
    Note over User,Database: Total Processing Time: 2-3 seconds`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HSV Color Space */}
        <TabsContent value="hsv">
          <Card>
            <CardHeader>
              <CardTitle>HSV Color Space Analysis</CardTitle>
              <CardDescription>How the system uses HSV color space for green detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`graph LR
    subgraph "Color Space Conversion"
        A["RGB Image"] --> B["Convert to HSV"]
    end
    
    subgraph "HSV Channels"
        B --> C["Hue Channel (H)"]
        B --> D["Saturation Channel (S)"]
        B --> E["Value Channel (V)"]
    end
    
    subgraph "Green Detection Thresholds"
        C --> F["H: 30° - 100°"]
        D --> G["S: 20 - 255"]
        E --> H["V: 30 - 255"]
    end
    
    subgraph "Mask Creation"
        F --> I["Combine Thresholds"]
        G --> I
        H --> I
        I --> J["Binary Mask"]
    end
    
    subgraph "Analysis"
        J --> K["Count White Pixels"]
        K --> L["Calculate Percentage"]
        L --> M["Germination Status"]
    end
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style J fill:#e1ffe1
    style M fill:#c8f7c5`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment */}
        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle>System Deployment Architecture</CardTitle>
              <CardDescription>Infrastructure and deployment configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`graph TB
    subgraph "Vercel Platform"
        A["Next.js Application"]
        B["Edge Functions"]
        C["API Routes"]
    end
    
    subgraph "Supabase Backend"
        D["PostgreSQL Database"]
        E["Storage Buckets"]
        F["Authentication"]
    end
    
    subgraph "External Services"
        G["Google Colab (Model Training)"]
        H["Python Processing (Optional)"]
    end
    
    subgraph "Client Access"
        I["Desktop Browser"]
        J["Mobile Browser"]
        K["Tablet Browser"]
    end
    
    I --> A
    J --> A
    K --> A
    
    A --> B
    A --> C
    
    C --> D
    C --> E
    C --> F
    
    G -.->|Model Export| A
    H -.->|API Integration| C
    
    style A fill:#e1f5ff
    style D fill:#f5e1ff
    style G fill:#ffe1e1`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Error Handling */}
        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Handling and Validation</CardTitle>
              <CardDescription>Comprehensive error handling flow throughout the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mermaid-container bg-slate-50 p-6 rounded-lg overflow-x-auto">
                <pre className="language-mermaid">
                  {`flowchart TD
    Start["Receive Upload"] --> Check1{"Valid Image?"}
    Check1 -->|No| Error1["Error: Invalid Format"]
    Check1 -->|Yes| Check2{"Image Size OK?"}
    
    Check2 -->|No| Error2["Error: Image Too Large"]
    Check2 -->|Yes| Process["Start Processing"]
    
    Process --> Check3{"Red Markers Found?"}
    Check3 -->|No| Warn1["Warning: No Markers"]
    Check3 -->|Yes| Mask["Apply Masking"]
    
    Warn1 --> Continue1["Continue with Original"]
    Mask --> Detect["YOLO Detection"]
    Continue1 --> Detect
    
    Detect --> Check4{"Trays Found?"}
    Check4 -->|No| Warn2["Warning: No Trays"]
    Check4 -->|Yes| Analyze["Analyze Green Pixels"]
    
    Warn2 --> Return1["Return Empty Results"]
    Analyze --> Check5{"Analysis Complete?"}
    
    Check5 -->|No| Error3["Error: Analysis Failed"]
    Check5 -->|Yes| Success["Return Results"]
    
    Error1 --> End
    Error2 --> End
    Return1 --> End
    Error3 --> End
    Success --> End["Display to User"]
    
    style Check1 fill:#fff4e1
    style Check2 fill:#fff4e1
    style Check3 fill:#fff4e1
    style Check4 fill:#fff4e1
    style Check5 fill:#fff4e1
    style Error1 fill:#ffc8c8
    style Error2 fill:#ffc8c8
    style Error3 fill:#ffc8c8
    style Success fill:#c8f7c5`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Detection Parameters</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ YOLO Confidence Threshold: 50%</li>
                <li>✓ Green Percentage Threshold: 7%</li>
                <li>✓ Green Hue Range: 30-100°</li>
                <li>✓ Minimum Saturation: 20</li>
                <li>✓ Minimum Value: 30</li>
                <li>✓ Min Contour Area: 100px</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Processing Steps</h3>
              <ul className="space-y-2 text-sm">
                <li>1️⃣ Red marker detection (HSV range)</li>
                <li>2️⃣ Area masking above reference line</li>
                <li>3️⃣ YOLO model inference</li>
                <li>4️⃣ Tray crop extraction</li>
                <li>5️⃣ Green pixel analysis (HSV)</li>
                <li>6️⃣ Germination classification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Mermaid Script */}
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof mermaid !== 'undefined') {
              mermaid.initialize({ 
                startOnLoad: true,
                theme: 'default',
                securityLevel: 'loose',
              });
            }
          `,
        }}
      />
    </div>
  )
}
