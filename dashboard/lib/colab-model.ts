// Connect to your Colab-hosted model
export interface ColabModelConfig {
  endpoint: string // Your Colab model endpoint URL
  apiKey?: string // Optional API key if needed
  timeout?: number // Request timeout in ms
}

export interface GerminationPrediction {
  germinatedCount: number
  totalSeeds: number
  germinationRate: number
  confidence: number
  areas?: Array<{ x: number; y: number; width: number; height: number }>
  assessment?: string
}

export async function analyzeWithColabModel(
  imageUrl: string,
  config: ColabModelConfig,
): Promise<GerminationPrediction> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.timeout || 30000)

  try {
    console.log("[v0] Calling GerminationNet model at:", config.endpoint)

    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        image_url: imageUrl,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GerminationNet error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] GerminationNet response:", data)

    // Handle GerminationNet PyTorch model response format
    const probability = data.probability || data.prob || 0
    const isGerminated = probability >= 0.5

    return {
      germinatedCount: isGerminated ? 1 : 0,
      totalSeeds: 1,
      germinationRate: probability * 100,
      confidence: probability,
      assessment: generateAssessment(probability * 100),
    }
  } catch (error) {
    clearTimeout(timeout)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("GerminationNet request timed out")
      }
      console.error("[v0] GerminationNet analysis failed:", error.message)
      throw new Error(`GerminationNet failed: ${error.message}`)
    }

    throw new Error("Unknown error calling GerminationNet")
  }
}

function generateAssessment(rate: number): string {
  if (rate >= 80) return "Excellent germination - optimal conditions"
  if (rate >= 60) return "Good germination - normal growth expected"
  if (rate >= 40) return "Fair germination - monitor conditions"
  if (rate >= 20) return "Poor germination - check seed quality and environment"
  return "Very poor germination - investigate seed viability"
}

export async function testColabEndpoint(endpoint: string): Promise<boolean> {
  try {
    const healthUrl = endpoint.replace("/predict", "/health")
    const response = await fetch(healthUrl, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    })

    return response.ok
  } catch {
    try {
      const response = await fetch(endpoint, {
        method: "OPTIONS",
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }
}
