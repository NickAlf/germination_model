import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, seedType, dayNumber, modelId, provider } = await req.json()

    const prompt = `Analyze this microgreen germination photo for ${seedType} seeds on day ${dayNumber}. 
    Please provide:
    1. Current germination stage assessment
    2. Health indicators (color, density, growth pattern)
    3. Recommendations for next steps
    4. Any potential issues or concerns
    5. Expected timeline for next growth stage
    
    Be specific and practical for microgreen growers.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || "No analysis generated"

    return Response.json({ analysis, modelUsed: `${provider}:${modelId}` })
  } catch (error) {
    console.error("AI analysis error:", error)
    return Response.json({ error: "Failed to analyze photo" }, { status: 500 })
  }
}
