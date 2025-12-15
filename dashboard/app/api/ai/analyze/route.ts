import { analyzeWithHuggingFace, analyzeWithOllama } from "@/lib/ai-models"
import { GROWING_RECOMMENDATIONS } from "@/lib/seed-data"
import type { NextRequest } from "next/server"
import { env } from "@/lib/env"

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, seedType, dayNumber, modelId, provider, apiKey } = await req.json()

    // Get seed-specific recommendations
    const seedRec = GROWING_RECOMMENDATIONS[seedType as keyof typeof GROWING_RECOMMENDATIONS]

    const prompt = `You are an expert microgreen growing consultant analyzing a ${seedType} microgreen photo on day ${dayNumber}.

SEED-SPECIFIC DATA:
- Expected germination: ${seedRec?.expected_germination_days || 5} days
- Optimal temperature: ${seedRec?.optimal_temperature || 21}°C
- Optimal humidity: ${seedRec?.optimal_humidity || 75}%
- Success rate: ${((seedRec?.success_rate || 0.85) * 100).toFixed(0)}%

Please analyze this photo and provide:

1. **Current Stage Assessment**: What stage of growth is visible?
2. **Health Indicators**: Color, density, uniformity, any issues
3. **Growth Progress**: Is this normal for day ${dayNumber}?
4. **Environmental Recommendations**: Temperature, humidity, light adjustments
5. **Next Steps**: What to expect and when to harvest
6. **Quality Score**: Rate 1-10 with explanation

Be specific, practical, and encouraging. Focus on actionable advice for microgreen growers.`

    let analysisResult: string

    try {
      if (provider === "huggingface") {
        // Handle Hugging Face models
        const result = await analyzeWithHuggingFace(imageUrl, modelId, prompt)

        if (result.error) {
          throw new Error(result.error)
        }

        if (modelId.includes("blip2")) {
          // BLIP-2 returns image captions, we need to enhance it
          analysisResult = enhanceBasicCaption(
            result[0]?.generated_text || "No analysis available",
            seedType,
            dayNumber,
            seedRec,
          )
        } else {
          // LLaVA and other conversational models
          analysisResult =
            result.generated_text || result.response || "Analysis completed but no detailed response available."
        }
      } else if (provider === "ollama") {
        // Handle Ollama local models
        const result = await analyzeWithOllama(imageUrl, modelId, prompt)

        if (result.error) {
          throw new Error(result.error)
        }

        analysisResult = result.response || "Local analysis completed."
      } else {
        let apiKeyToUse = apiKey

        if (!apiKeyToUse) {
          if (provider === "openai" && env.OPENAI_API_KEY) {
            apiKeyToUse = env.OPENAI_API_KEY
          }
        }

        if (!apiKeyToUse) {
          throw new Error(`No API key provided for ${provider}`)
        }

        // Direct OpenAI API call
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKeyToUse}`,
          },
          body: JSON.stringify({
            model: modelId || "gpt-4o",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: imageUrl } },
                ],
              },
            ],
            max_tokens: 1000,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error?.message || response.statusText)
        }

        const data = await response.json()
        analysisResult = data.choices[0]?.message?.content || "No analysis generated"
      }

      const recommendations = extractRecommendations(analysisResult, seedType, dayNumber)

      return Response.json({
        analysis: analysisResult,
        modelUsed: `${provider}:${modelId}`,
        recommendations,
        seedData: seedRec,
        cost: getCostInfo(provider, modelId),
      })
    } catch (modelError: any) {
      console.error(`${provider} model error:`, modelError)

      let errorMessage = `Failed to analyze with ${provider} model. `

      if (provider === "huggingface") {
        errorMessage += "The Hugging Face model might be loading or rate limited. Try again in a few moments."
      } else if (provider === "ollama") {
        errorMessage += "Make sure Ollama is running locally and the model is installed."
      } else if (!apiKey && !env[`${provider.toUpperCase()}_API_KEY`]) {
        errorMessage += "Please provide a valid API key."
      } else {
        errorMessage += `Error: ${modelError.message || "Unknown error"}`
      }

      return Response.json(
        {
          error: errorMessage,
          analysis: `⚠️ Analysis Failed: ${errorMessage}\n\nTroubleshooting:\n1. For free models, try Hugging Face which requires no setup\n2. For Ollama, make sure it's installed and running\n3. For paid models, check your API key`,
        },
        { status: 200 },
      )
    }
  } catch (error: any) {
    console.error("AI analysis error:", error)
    return Response.json(
      {
        error: "Failed to analyze photo. Please try again.",
        analysis: `⚠️ Error: ${error.message || "Unknown error occurred"}\n\nPlease try again or select a different model.`,
      },
      { status: 200 },
    )
  }
}

function enhanceBasicCaption(caption: string, seedType: string, dayNumber: number, seedRec: any): string {
  // Enhance basic image captions with microgreen-specific analysis
  return `**AI Analysis Results (Enhanced Caption)**

**Image Description**: ${caption}

**Stage Assessment**: Based on day ${dayNumber} for ${seedType}, this appears to be in the ${dayNumber <= 3 ? "early sprouting" : dayNumber <= 7 ? "active growth" : "mature"} stage.

**Health Indicators**: The image shows microgreen development. For ${seedType}, optimal conditions include:
- Temperature: ${seedRec?.optimal_temperature || 21}°C
- Humidity: ${seedRec?.optimal_humidity || 75}%

**Recommendations**:
${seedRec?.growing_tips?.map((tip: string, i: number) => `${i + 1}. ${tip}`).join("\n") || "- Monitor growth daily\n- Maintain consistent moisture\n- Ensure adequate light"}

**Next Steps**: ${dayNumber < (seedRec?.expected_germination_days || 7) ? "Continue monitoring for germination" : "Prepare for harvest when leaves are 1-2 inches tall"}

**Quality Score**: 7/10 - Analysis based on image recognition. For more detailed analysis, try a conversational AI model.

*Note: This analysis uses a basic vision model. For more detailed insights, consider using GPT-4o, Claude, or LLaVA models.*`
}

function extractRecommendations(analysis: string, seedType: string, dayNumber: number): string[] {
  const recommendations = []

  // Basic recommendations based on day and seed type
  if (dayNumber <= 2) {
    recommendations.push("Maintain consistent moisture levels")
    recommendations.push("Ensure proper temperature control")
  } else if (dayNumber <= 5) {
    recommendations.push("Monitor for even germination")
    recommendations.push("Check for adequate air circulation")
  } else {
    recommendations.push("Prepare for harvest timing")
    recommendations.push("Assess quality and color development")
  }

  // Add seed-specific recommendations
  const seedRec = GROWING_RECOMMENDATIONS[seedType as keyof typeof GROWING_RECOMMENDATIONS]
  if (seedRec?.growing_tips) {
    recommendations.push(...seedRec.growing_tips.slice(0, 2))
  }

  return recommendations
}

function getCostInfo(provider: string, modelId: string) {
  const costInfo: Record<string, { cost: string; limit: string }> = {
    huggingface: { cost: "Free", limit: "Rate limited" },
    ollama: { cost: "Free", limit: "Hardware dependent" },
    openai: modelId.includes("mini")
      ? { cost: "Free tier", limit: "Monthly limits" }
      : { cost: "$0.01-0.03 per image", limit: "Pay per use" },
    anthropic: { cost: "$0.008-0.025 per image", limit: "Pay per use" },
    google: { cost: "$0.002-0.01 per image", limit: "Pay per use" },
  }

  return costInfo[provider] || { cost: "Unknown", limit: "Unknown" }
}
