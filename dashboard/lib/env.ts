import { z } from "zod"

const envSchema = z.object({
  // AI Model API Keys
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),

  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Dataset Access
  SEEDS_DATASET_URL: z.string().optional(),
  DRIVE_FOLDER_ID: z.string().optional(),

  // Legacy Kaggle (keeping for backward compatibility)
  KAGGLE_USERNAME: z.string().optional(),
  KAGGLE_KEY: z.string().optional(),

  // Python API Configuration
  PYTHON_API_URL: z.string().optional(),

  // Blob Storage
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
})

export const env = envSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SEEDS_DATASET_URL: process.env.SEEDS_DATASET_URL,
  DRIVE_FOLDER_ID: process.env.DRIVE_FOLDER_ID,
  KAGGLE_USERNAME: process.env.KAGGLE_USERNAME,
  KAGGLE_KEY: process.env.KAGGLE_KEY,
  PYTHON_API_URL: process.env.PYTHON_API_URL || "http://localhost:5000",
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
})

export function validateAIEnv() {
  return !!(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY)
}

export function validateDatasetEnv() {
  return !!(env.SEEDS_DATASET_URL || env.DRIVE_FOLDER_ID)
}

export function validateKaggleEnv() {
  return !!(env.KAGGLE_USERNAME && env.KAGGLE_KEY)
}
