import { NextResponse } from "next/server"
import { predictWithGerminationNet } from "@/lib/germination-net"

export async function POST(req: Request) {
  try {
    const { imageUrl, colabEndpoint, useColab } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
    }

    let result

    // Try Colab model first if enabled
    if (useColab && colabEndpoint) {
      try {
        console.log("[v0] Attempting GerminationNet prediction...")
        const prediction = await predictWithGerminationNet(imageUrl, colabEndpoint)

        result = {
          success: true,
          source: "colab",
          probability: prediction.probability,
          isGerminated: prediction.isGerminated,
          confidence: prediction.confidence,
          germinatedCount: prediction.isGerminated ? 1 : 0,
          totalSeeds: 1,
          germinationRate: prediction.probability * 100,
        }

        console.log("[v0] GerminationNet prediction successful:", prediction.probability)
      } catch (colabError) {
        console.log("[v0] GerminationNet failed, falling back to ChatGPT:", colabError)
        // Fall through to ChatGPT
      }
    }

    // Fallback to ChatGPT if Colab failed or not enabled
    if (!result) {
      console.log("[v0] Using ChatGPT for analysis...")
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
                  text: "Analyze this seed germination image. Count total seeds and germinated seeds. Provide germination rate percentage and confidence level. Format: {germinated: X, total: Y, rate: Z%, confidence: 0.X}",
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

      // Parse ChatGPT response
      const match = text.match(/germinated:\s*(\d+).*?total:\s*(\d+).*?rate:\s*(\d+)%.*?confidence:\s*(0\.\d+|\d+)/i)

      if (match) {
        const germinated = Number.parseInt(match[1])
        const total = Number.parseInt(match[2])
        const rate = Number.parseInt(match[3])
        const confidence = Number.parseFloat(match[4])

        result = {
          success: true,
          source: "gpt",
          germinatedCount: germinated,
          totalSeeds: total,
          germinationRate: rate,
          confidence: confidence > 1 ? confidence / 100 : confidence,
          assessment: text,
        }
      } else {
        result = {
          success: true,
          source: "gpt",
          germinatedCount: 0,
          totalSeeds: 0,
          germinationRate: 0,
          confidence: 0.5,
          assessment: text,
        }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 })
  }
}
