import { type NextRequest, NextResponse } from "next/server"
import { predictWithGerminationNet } from "@/lib/germination-net"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, useColab, colabEndpoint } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    if (useColab && colabEndpoint) {
      try {
        console.log("[v0] Analyzing with GerminationNet model...")
        const prediction = await predictWithGerminationNet(imageUrl, colabEndpoint)

        return NextResponse.json({
          success: true,
          source: "colab",
          probability: prediction.probability,
          isGerminated: prediction.isGerminated,
          confidence: prediction.confidence,
          germinatedCount: prediction.isGerminated ? 1 : 0,
          totalSeeds: 1,
          germinationRate: prediction.probability * 100,
        })
      } catch (error) {
        console.log("[v0] GerminationNet failed:", error)
        return NextResponse.json({ error: "Failed to connect to Colab model. Check your ngrok URL." }, { status: 500 })
      }
    }

    console.log("[v0] Using demo/dummy data...")
    return NextResponse.json({
      success: true,
      source: "demo",
      germinatedCount: 8,
      totalSeeds: 10,
      germinationRate: 80,
      confidence: 0.92,
      assessment: "Demo data: Strong germination detected. Healthy seedling development observed.",
    })
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
