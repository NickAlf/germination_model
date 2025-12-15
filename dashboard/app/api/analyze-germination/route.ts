import { type NextRequest, NextResponse } from "next/server"
import { predictWithGerminationNet } from "@/lib/germination-net"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, useColab, colabEndpoint } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    let result

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
        console.log("[v0] GerminationNet failed, falling back to ChatGPT:", error)
        // Fall through to ChatGPT
      }
    }

    console.log("[v0] Analyzing with ChatGPT...")
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this seed germination image. Count total seeds and germinated seeds. Provide germination rate percentage and assessment. Return JSON with: germinated_seeds, total_seeds, germination_rate, growth_stage",
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ""

    // Parse GPT response
    try {
      const analysis = JSON.parse(text)
      return NextResponse.json({
        success: true,
        source: "gpt",
        germinatedCount: analysis.germinated_seeds || 0,
        totalSeeds: analysis.total_seeds || 0,
        germinationRate: analysis.germination_rate || 0,
        confidence: 0.85,
        assessment: analysis.growth_stage || "Analysis complete",
      })
    } catch {
      // If JSON parsing fails, extract numbers from text
      const numbers = text.match(/\d+/g) || []
      return NextResponse.json({
        success: true,
        source: "gpt",
        germinatedCount: numbers[0] ? Number.parseInt(numbers[0]) : 0,
        totalSeeds: numbers[1] ? Number.parseInt(numbers[1]) : 0,
        germinationRate: numbers[2] ? Number.parseInt(numbers[2]) : 0,
        confidence: 0.75,
        assessment: text,
      })
    }
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
