import { type NextRequest, NextResponse } from "next/server"

interface TrayResult {
  trayIndex: number
  germinated: boolean
  greenPercentage: number
  confidence: number
  bbox: number[]
}

// Python backend URL (configure this based on your deployment)
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { image, config } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate image is base64
    if (!image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }

    // Call Python backend for real model inference
    const pythonResponse = await fetch(`${PYTHON_API_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        config: config || {
          detectionConfidence: 0.5,
          greenThreshold: 7.0,
        },
      }),
    })

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json()
      throw new Error(errorData.error || "Python API failed")
    }

    const result = await pythonResponse.json()

    // Add total processing time (including network)
    const totalProcessingTime = (Date.now() - startTime) / 1000

    return NextResponse.json({
      ...result,
      totalProcessingTime,
      pythonProcessingTime: result.processingTime,
    })
  } catch (error) {
    console.error("Analysis error:", error)

    // Fallback to mock data if Python backend is unavailable
    if (error instanceof Error && error.message.includes("fetch")) {
      console.warn("Python backend unavailable, using mock data")
      return getMockData(startTime)
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze image" },
      { status: 500 },
    )
  }
}

// Fallback mock data function (same as before)
function getMockData(startTime: number) {
  const redMarkersFound = Math.random() > 0.3
  const numTrays = Math.floor(Math.random() * 8) + 2
  const trays: TrayResult[] = []
  let germinatedCount = 0

  for (let i = 0; i < numTrays; i++) {
    const greenPercentage = Math.random() * 15
    const germinated = greenPercentage > 7

    if (germinated) germinatedCount++

    trays.push({
      trayIndex: i,
      germinated,
      greenPercentage,
      confidence: 0.5 + Math.random() * 0.5,
      bbox: [
        Math.floor(Math.random() * 200),
        Math.floor(Math.random() * 200),
        Math.floor(Math.random() * 200) + 100,
        Math.floor(Math.random() * 200) + 100,
      ],
    })
  }

  const processingTime = (Date.now() - startTime) / 1000

  return NextResponse.json({
    success: true,
    isMockData: true,
    totalTrays: numTrays,
    germinatedTrays: germinatedCount,
    notGerminatedTrays: numTrays - germinatedCount,
    germinationRate: (germinatedCount / numTrays) * 100,
    trays,
    redMarkersFound,
    processingTime,
    config: {
      detectionConfidence: 0.5,
      greenThreshold: 7,
      greenHueRange: [30, 100],
      greenSaturationMin: 20,
      greenValueMin: 30,
    },
  })
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/health`)
    const data = await response.json()
    return NextResponse.json({
      status: "ok",
      pythonBackend: data.status,
      modelLoaded: data.model_loaded,
    })
  } catch (error) {
    return NextResponse.json({
      status: "degraded",
      pythonBackend: "unavailable",
      modelLoaded: false,
      usingMockData: true,
    })
  }
}
