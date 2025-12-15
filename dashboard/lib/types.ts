export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  created_at: string
}

export interface GerminationRecord {
  id: string
  user_id: string
  seed_type: string
  planting_date: string
  expected_germination_days: number
  current_stage: "planted" | "sprouting" | "germinated" | "mature"
  notes?: string
  created_at: string
  updated_at: string
}

export interface PhotoRecord {
  id: string
  germination_record_id: string
  photo_url: string
  day_number: number
  ai_analysis?: string
  ai_model_used?: string
  uploaded_at: string
}

export interface AIAnalysisRequest {
  imageUrl: string
  seedType: string
  dayNumber: number
  modelId: string
  provider: "openai" | "anthropic" | "google" | "custom"
}

export interface AIAnalysisResponse {
  analysis: string
  modelUsed: string
  confidence?: number
  recommendations?: string[]
}

export interface SeedRecommendation {
  seed_type: string
  optimal_temperature: number
  optimal_humidity: number
  expected_germination_days: number
  success_rate: number
  growing_tips: string[]
}
