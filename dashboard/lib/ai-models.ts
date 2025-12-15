// This file contains AI model configurations for germination analysis
export interface AIModel {
  id: string
  name: string
  provider: string
  model_id: string
  description: string
  specialized_for: string[]
  cost: "free" | "paid"
  requiresApiKey: boolean
  setupInstructions?: string
  limitations?: string[]
}

export const AI_MODELS: AIModel[] = [
  // Free Open Source Models
  {
    id: "huggingface-blip2",
    name: "BLIP-2 Vision",
    provider: "huggingface",
    model_id: "Salesforce/blip2-opt-2.7b",
    description: "Free open-source vision model for image analysis",
    specialized_for: ["general", "plant-analysis", "image-captioning"],
    cost: "free",
    requiresApiKey: false,
    setupInstructions: "No setup required - runs on Hugging Face free tier",
    limitations: ["Rate limited", "Basic analysis", "No specialized plant knowledge"],
  },
  {
    id: "huggingface-llava",
    name: "LLaVA 1.5",
    provider: "huggingface",
    model_id: "llava-hf/llava-1.5-7b-hf",
    description: "Open-source multimodal model with vision capabilities",
    specialized_for: ["detailed-analysis", "plant-health", "general"],
    cost: "free",
    requiresApiKey: false,
    setupInstructions: "Uses Hugging Face Inference API - free tier available",
    limitations: ["Slower processing", "Limited concurrent requests"],
  },
  {
    id: "ollama-llava",
    name: "Ollama LLaVA (Local)",
    provider: "ollama",
    model_id: "llava:7b",
    description: "Run LLaVA locally with Ollama - completely free and private",
    specialized_for: ["privacy", "offline", "plant-analysis"],
    cost: "free",
    requiresApiKey: false,
    setupInstructions: "Install Ollama locally and pull llava:7b model",
    limitations: ["Requires local setup", "Hardware dependent", "Slower than cloud models"],
  },
  {
    id: "openai-free",
    name: "GPT-4o Mini (Free Tier)",
    provider: "openai",
    model_id: "gpt-4o-mini",
    description: "OpenAI's free tier model with vision capabilities",
    specialized_for: ["general", "plant-analysis"],
    cost: "free",
    requiresApiKey: true,
    setupInstructions: "Create free OpenAI account - includes free credits",
    limitations: ["Monthly usage limits", "Requires API key"],
  },

  // Premium Models
  {
    id: "gpt-4o",
    name: "GPT-4 Vision Pro",
    provider: "openai",
    model_id: "gpt-4o",
    description: "Advanced vision analysis with detailed insights",
    specialized_for: ["detailed-analysis", "plant-health", "expert-recommendations"],
    cost: "paid",
    requiresApiKey: true,
    limitations: ["Pay per use", "Higher cost"],
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    model_id: "claude-3-5-sonnet-20241022",
    description: "Excellent for detailed plant analysis and recommendations",
    specialized_for: ["detailed-analysis", "plant-health", "scientific-analysis"],
    cost: "paid",
    requiresApiKey: true,
    limitations: ["Pay per use", "API key required"],
  },
  {
    id: "gemini-pro-vision",
    name: "Gemini 1.5 Pro Vision",
    provider: "google",
    model_id: "gemini-1.5-pro-vision-latest",
    description: "Google's multimodal AI with good plant analysis capabilities",
    specialized_for: ["general", "plant-analysis", "cost-effective"],
    cost: "paid",
    requiresApiKey: true,
    limitations: ["Pay per use", "API key required"],
  },
]

export const FREE_MODELS = AI_MODELS.filter((model) => model.cost === "free")
export const PAID_MODELS = AI_MODELS.filter((model) => model.cost === "paid")

export async function analyzeWithHuggingFace(imageUrl: string, modelId: string, prompt: string) {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          image: imageUrl,
          text: prompt,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Hugging Face analysis error:", error)
    return { error: "Failed to analyze with Hugging Face model. The model might be loading or rate limited." }
  }
}

export async function analyzeWithOllama(imageUrl: string, modelId: string, prompt: string) {
  try {
    // Assumes Ollama is running locally on default port
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        prompt: prompt,
        images: [imageUrl],
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Ollama analysis error:", error)
    return {
      error: "Failed to connect to Ollama. Make sure Ollama is running locally and the model is installed.",
      response:
        "Error connecting to local Ollama instance. Please make sure Ollama is installed and running with the llava:7b model.",
    }
  }
}

export function getAIModel(modelId: string) {
  return AI_MODELS.find((model) => model.id === modelId) || AI_MODELS[0]
}
