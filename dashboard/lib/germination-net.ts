// GerminationNet Model Integration
// Connects to your PyTorch ResNet18 model running in Google Colab

export interface GerminationPrediction {
  probability: number
  isGerminated: boolean
  confidence: number
  modelSource: "colab"
}

export async function predictWithGerminationNet(
  imageUrl: string,
  colabEndpoint: string,
): Promise<GerminationPrediction> {
  try {
    // Send image to your Colab model
    const response = await fetch(colabEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    })

    if (!response.ok) {
      throw new Error(`Colab model returned ${response.status}`)
    }

    const data = await response.json()

    // Your model returns probability from 0-1
    const probability = data.probability || data.prob || 0
    const isGerminated = probability >= 0.5

    return {
      probability,
      isGerminated,
      confidence: probability,
      modelSource: "colab",
    }
  } catch (error) {
    console.error("[v0] GerminationNet prediction failed:", error)
    throw error
  }
}

// Test if the Colab endpoint is healthy
export async function testGerminationNetEndpoint(endpoint: string): Promise<boolean> {
  try {
    const healthUrl = endpoint.replace("/predict", "/health")
    const response = await fetch(healthUrl, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    })
    return response.ok
  } catch {
    return false
  }
}
