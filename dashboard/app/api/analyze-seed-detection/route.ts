import { type NextRequest, NextResponse } from "next/server"

interface DetectionRequest {
  image: string
  seedType: string
}

interface Detection {
  id: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  status: "germinated" | "not_germinated"
  type: string
}

interface DetectionResult {
  seedCount: number
  germinatedCount: number
  germinationPercentage: number
  confidence: number
  detections: Detection[]
  processingTime: number
  imageUrl: string
}

export async function POST(request: NextRequest) {
  try {
    const { image, seedType }: DetectionRequest = await request.json()

    if (!image || !seedType) {
      return NextResponse.json({ error: "Image and seed type are required" }, { status: 400 })
    }

    const startTime = Date.now()

    // Simulate AI model processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate realistic detection results based on seed type
    const detectionResults = generateDetectionResults(seedType)
    const processingTime = Date.now() - startTime

    const result: DetectionResult = {
      ...detectionResults,
      processingTime,
      imageUrl: image,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Seed detection analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}

function generateDetectionResults(seedType: string): Omit<DetectionResult, "processingTime" | "imageUrl"> {
  // Generate realistic results based on seed type characteristics
  const seedTypeData = {
    Broccoli: { baseGermination: 0.85, seedCount: [15, 25], confidence: 0.92 },
    Radish: { baseGermination: 0.9, seedCount: [20, 35], confidence: 0.94 },
    "Pea Shoots": { baseGermination: 0.88, seedCount: [10, 18], confidence: 0.89 },
    Sunflower: { baseGermination: 0.82, seedCount: [8, 15], confidence: 0.91 },
    Wheatgrass: { baseGermination: 0.87, seedCount: [25, 40], confidence: 0.93 },
    Kale: { baseGermination: 0.83, seedCount: [18, 28], confidence: 0.9 },
    Arugula: { baseGermination: 0.89, seedCount: [22, 32], confidence: 0.92 },
    Mustard: { baseGermination: 0.91, seedCount: [20, 30], confidence: 0.94 },
    Cabbage: { baseGermination: 0.84, seedCount: [16, 24], confidence: 0.88 },
    Alfalfa: { baseGermination: 0.86, seedCount: [30, 50], confidence: 0.87 },
    Clover: { baseGermination: 0.85, seedCount: [25, 40], confidence: 0.89 },
    Fenugreek: { baseGermination: 0.8, seedCount: [12, 20], confidence: 0.86 },
    Cress: { baseGermination: 0.92, seedCount: [35, 55], confidence: 0.95 },
    Chia: { baseGermination: 0.88, seedCount: [40, 60], confidence: 0.9 },
    Flax: { baseGermination: 0.81, seedCount: [15, 25], confidence: 0.87 },
  }

  const typeData = seedTypeData[seedType as keyof typeof seedTypeData] || seedTypeData["Broccoli"]

  // Generate random seed count within range
  const seedCount =
    Math.floor(Math.random() * (typeData.seedCount[1] - typeData.seedCount[0] + 1)) + typeData.seedCount[0]

  // Add some randomness to germination rate (±5%)
  const germinationRate = typeData.baseGermination + (Math.random() - 0.5) * 0.1
  const germinatedCount = Math.floor(seedCount * germinationRate)
  const germinationPercentage = (germinatedCount / seedCount) * 100

  // Generate individual detections
  const detections: Detection[] = []
  for (let i = 0; i < seedCount; i++) {
    const isGerminated = i < germinatedCount
    detections.push({
      id: `seed_${i + 1}`,
      x: Math.random() * 80 + 10, // 10-90% from left
      y: Math.random() * 80 + 10, // 10-90% from top
      width: Math.random() * 8 + 4, // 4-12% width
      height: Math.random() * 8 + 4, // 4-12% height
      confidence: typeData.confidence + (Math.random() - 0.5) * 0.1,
      status: isGerminated ? "germinated" : "not_germinated",
      type: seedType,
    })
  }

  // Shuffle detections to randomize positions
  for (let i = detections.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[detections[i], detections[j]] = [detections[j], detections[i]]
  }

  return {
    seedCount,
    germinatedCount,
    germinationPercentage,
    confidence: typeData.confidence,
    detections,
  }
}
