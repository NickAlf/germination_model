import type { GerminationRecord, PhotoRecord } from "./types"

/**
 * Sample germination records shown when the app is in demo mode.
 * Feel free to tweak or extend these objects for your own demos.
 */
export const DEMO_GERMINATION_RECORDS: GerminationRecord[] = [
  {
    id: "demo-1",
    user_id: "demo-user",
    seed_type: "Broccoli",
    planting_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // planted 3 days ago
    expected_germination_days: 7,
    current_stage: "sprouting",
    notes: "Demo broccoli microgreens",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    user_id: "demo-user",
    seed_type: "Radish",
    planting_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // planted 5 days ago
    expected_germination_days: 5,
    current_stage: "germinated",
    notes: "Demo radish microgreens",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    user_id: "demo-user",
    seed_type: "Pea Shoots",
    planting_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // planted 10 days ago
    expected_germination_days: 14,
    current_stage: "mature",
    notes: "Demo pea shoots",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

/**
 * Sample photos (and AI analyses) linked to the demo germination records.
 * Images should live in /public so they can be served statically.
 */
export const DEMO_PHOTOS: PhotoRecord[] = [
  {
    id: "photo-1",
    germination_record_id: "demo-1",
    photo_url: "/placeholder.svg?height=300&width=400&text=Broccoli+Day+3",
    day_number: 3,
    ai_analysis: "Healthy sprouting observed. Maintain moisture levels.",
    ai_model_used: "openai:gpt-4o",
    uploaded_at: new Date().toISOString(),
  },
  {
    id: "photo-2",
    germination_record_id: "demo-2",
    photo_url: "/placeholder.svg?height=300&width=400&text=Radish+Day+5",
    day_number: 5,
    ai_analysis: "Germination complete. Ensure adequate lighting.",
    ai_model_used: "anthropic:claude-3-5-sonnet-20241022",
    uploaded_at: new Date().toISOString(),
  },
  {
    id: "photo-3",
    germination_record_id: "demo-3",
    photo_url: "/placeholder.svg?height=300&width=400&text=Pea+Shoots+Day+10",
    day_number: 10,
    ai_analysis: "Mature pea shoots ready for harvest.",
    ai_model_used: "openai:gpt-4o",
    uploaded_at: new Date().toISOString(),
  },
]
