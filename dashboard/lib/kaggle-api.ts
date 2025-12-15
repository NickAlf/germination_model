import { env } from "./env"
import { validateDatasetEnv } from "./seeds-dataset-api"

// Kaggle dataset types
export interface KaggleDatasetInfo {
  ref: string
  title: string
  size: number
  lastUpdated: string
  downloadCount: number
  voteCount: number
  usabilityRating: number
}

export interface KaggleDatasetFile {
  name: string
  size: number
  creationDate: string
}

export interface SeedGerminationRecord {
  image_id: string
  seed_type: string
  day_number: number
  growth_stage: "planted" | "sprouting" | "germinated" | "mature"
  germination_rate: number
  features: string[]
  temperature: number
  humidity: number
  success_rate: number
  annotations: string
  image_url?: string
}

export interface KaggleTrainingData {
  [seedType: string]: {
    [dayKey: string]: {
      stage: string
      germination_rate: number
      typical_features: string[]
      sample_count: number
      success_rate: number
      temperature_range: [number, number]
      humidity_range: [number, number]
      annotations: string[]
    }
  }
}

// Kaggle API client
class KaggleAPI {
  private baseUrl = "https://www.kaggle.com/api/v1"
  private credentials: string

  constructor() {
    if (!validateDatasetEnv()) {
      throw new Error("Kaggle API credentials not configured")
    }

    // Create base64 encoded credentials
    this.credentials = Buffer.from(`${env.KAGGLE_USERNAME}:${env.KAGGLE_KEY}`).toString("base64")
  }

  private async makeRequest(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Basic ${this.credentials}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`Kaggle API error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Kaggle API request failed:", error)
      throw error
    }
  }

  async getDatasetInfo(datasetRef: string): Promise<KaggleDatasetInfo> {
    try {
      const data = await this.makeRequest(`/datasets/view/${datasetRef}`)
      return {
        ref: data.ref,
        title: data.title,
        size: data.totalBytes,
        lastUpdated: data.lastUpdated,
        downloadCount: data.downloadCount,
        voteCount: data.voteCount,
        usabilityRating: data.usabilityRating,
      }
    } catch (error) {
      console.error("Failed to fetch dataset info:", error)
      throw error
    }
  }

  async getDatasetFiles(datasetRef: string): Promise<KaggleDatasetFile[]> {
    try {
      const data = await this.makeRequest(`/datasets/list/${datasetRef}/files`)
      return data.map((file: any) => ({
        name: file.name,
        size: file.totalBytes,
        creationDate: file.creationDate,
      }))
    } catch (error) {
      console.error("Failed to fetch dataset files:", error)
      throw error
    }
  }

  async downloadDatasetFile(datasetRef: string, fileName: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/datasets/download/${datasetRef}/${fileName}`, {
        headers: {
          Authorization: `Basic ${this.credentials}`,
        },
        timeout: 30000, // 30 second timeout for downloads
      })

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      console.error("Failed to download dataset file:", error)
      throw error
    }
  }
}

// Cache for training data to avoid repeated API calls
let trainingDataCache: KaggleTrainingData | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function getKaggleTrainingData(forceRefresh = false): Promise<KaggleTrainingData> {
  // Return cached data if available and not expired
  if (!forceRefresh && trainingDataCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return trainingDataCache
  }

  try {
    if (!validateDatasetEnv()) {
      console.warn("Kaggle credentials not available, using fallback data")
      return getFallbackTrainingData()
    }

    // For now, we'll use fallback data since we don't have a real dataset reference
    // In a real implementation, you would replace this with actual Kaggle API calls
    console.log("Kaggle credentials available, but using fallback data for demo")
    const trainingData = getFallbackTrainingData()

    // Cache the results
    trainingDataCache = trainingData
    cacheTimestamp = Date.now()

    return trainingData

    /* 
    // Uncomment this section when you have a real Kaggle dataset
    const kaggle = new KaggleAPI()
    const datasetRef = "your-username/microgreen-germination-dataset"

    try {
      const datasetInfo = await kaggle.getDatasetInfo(datasetRef)
      console.log("Connected to Kaggle dataset:", datasetInfo.title)

      const csvData = await kaggle.downloadDatasetFile(datasetRef, "germination_data.csv")
      const trainingData = parseCSVToTrainingData(csvData)

      trainingDataCache = trainingData
      cacheTimestamp = Date.now()

      return trainingData
    } catch (apiError) {
      console.warn("Kaggle API call failed, using fallback data:", apiError)
      return getFallbackTrainingData()
    }
    */
  } catch (error) {
    console.error("Error fetching Kaggle training data:", error)
    return getFallbackTrainingData()
  }
}

function parseCSVToTrainingData(csvData: string): KaggleTrainingData {
  const lines = csvData.split("\n")
  const headers = lines[0].split(",")
  const trainingData: KaggleTrainingData = {}

  // Parse CSV rows
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",")
    if (row.length < headers.length) continue

    const record: any = {}
    headers.forEach((header, index) => {
      record[header.trim()] = row[index]?.trim()
    })

    // Extract key fields
    const seedType = record.seed_type || record.variety
    const dayNumber = Number.parseInt(record.day_number || record.day)
    const stage = record.growth_stage || record.stage
    const germinationRate = Number.parseFloat(record.germination_rate || record.success_rate || "0")
    const features = (record.features || record.annotations || "").split(";").filter(Boolean)

    if (!seedType || !dayNumber) continue

    // Initialize seed type if not exists
    if (!trainingData[seedType]) {
      trainingData[seedType] = {}
    }

    const dayKey = `day_${dayNumber}`

    // Aggregate data for this seed type and day
    if (!trainingData[seedType][dayKey]) {
      trainingData[seedType][dayKey] = {
        stage: stage || "unknown",
        germination_rate: germinationRate,
        typical_features: features,
        sample_count: 1,
        success_rate: germinationRate,
        temperature_range: [20, 25],
        humidity_range: [70, 80],
        annotations: [record.notes || record.observations || ""].filter(Boolean),
      }
    } else {
      // Update aggregated data
      const existing = trainingData[seedType][dayKey]
      existing.sample_count += 1
      existing.germination_rate = (existing.germination_rate + germinationRate) / 2
      existing.typical_features = [...new Set([...existing.typical_features, ...features])]
      if (record.notes || record.observations) {
        existing.annotations.push(record.notes || record.observations)
      }
    }
  }

  return trainingData
}

// Fallback training data when Kaggle API is not available
function getFallbackTrainingData(): KaggleTrainingData {
  return {
    Broccoli: {
      day_1: {
        stage: "seed",
        germination_rate: 0,
        typical_features: ["dry_seeds", "no_growth"],
        sample_count: 45,
        success_rate: 0.92,
        temperature_range: [18, 22],
        humidity_range: [75, 85],
        annotations: ["Seeds planted in growing medium", "No visible activity expected"],
      },
      day_2: {
        stage: "sprouting",
        germination_rate: 0.15,
        typical_features: ["root_emergence", "seed_coat_cracking"],
        sample_count: 42,
        success_rate: 0.89,
        temperature_range: [19, 23],
        humidity_range: [78, 88],
        annotations: ["First signs of germination", "Root tips becoming visible"],
      },
      day_3: {
        stage: "early_germination",
        germination_rate: 0.45,
        typical_features: ["visible_roots", "cotyledon_emergence"],
        sample_count: 38,
        success_rate: 0.87,
        temperature_range: [20, 24],
        humidity_range: [75, 85],
        annotations: ["Cotyledons pushing through soil", "Root system developing"],
      },
      day_4: {
        stage: "active_germination",
        germination_rate: 0.75,
        typical_features: ["cotyledon_expansion", "stem_elongation"],
        sample_count: 35,
        success_rate: 0.85,
        temperature_range: [20, 24],
        humidity_range: [70, 80],
        annotations: ["Rapid vertical growth", "Cotyledons fully expanded"],
      },
      day_5: {
        stage: "established_seedling",
        germination_rate: 0.85,
        typical_features: ["full_cotyledons", "uniform_height"],
        sample_count: 33,
        success_rate: 0.88,
        temperature_range: [19, 23],
        humidity_range: [65, 75],
        annotations: ["Uniform stand established", "Ready for first harvest consideration"],
      },
      day_6: {
        stage: "mature_microgreen",
        germination_rate: 0.9,
        typical_features: ["true_leaves_emerging", "harvest_ready"],
        sample_count: 31,
        success_rate: 0.9,
        temperature_range: [18, 22],
        humidity_range: [60, 70],
        annotations: ["First true leaves visible", "Optimal harvest window opening"],
      },
      day_7: {
        stage: "harvest_stage",
        germination_rate: 0.92,
        typical_features: ["full_development", "optimal_harvest"],
        sample_count: 29,
        success_rate: 0.92,
        temperature_range: [18, 22],
        humidity_range: [60, 70],
        annotations: ["Peak harvest quality", "Maximum nutritional content"],
      },
    },
    Radish: {
      day_1: {
        stage: "seed",
        germination_rate: 0,
        typical_features: ["large_seeds", "no_growth"],
        sample_count: 52,
        success_rate: 0.95,
        temperature_range: [16, 20],
        humidity_range: [70, 80],
        annotations: ["Large seeds with high germination potential"],
      },
      day_2: {
        stage: "rapid_sprouting",
        germination_rate: 0.25,
        typical_features: ["fast_root_emergence", "seed_swelling"],
        sample_count: 49,
        success_rate: 0.94,
        temperature_range: [17, 21],
        humidity_range: [75, 85],
        annotations: ["Radish shows faster initial germination than most varieties"],
      },
      day_3: {
        stage: "early_germination",
        germination_rate: 0.6,
        typical_features: ["purple_stems", "cotyledon_emergence"],
        sample_count: 46,
        success_rate: 0.93,
        temperature_range: [18, 22],
        humidity_range: [70, 80],
        annotations: ["Characteristic purple coloration developing", "Rapid cotyledon emergence"],
      },
      day_4: {
        stage: "active_germination",
        germination_rate: 0.85,
        typical_features: ["vibrant_purple", "rapid_growth"],
        sample_count: 44,
        success_rate: 0.92,
        temperature_range: [18, 22],
        humidity_range: [65, 75],
        annotations: ["Intense purple pigmentation", "Very rapid vertical growth"],
      },
      day_5: {
        stage: "mature_microgreen",
        germination_rate: 0.92,
        typical_features: ["full_cotyledons", "harvest_ready"],
        sample_count: 42,
        success_rate: 0.95,
        temperature_range: [17, 21],
        humidity_range: [60, 70],
        annotations: ["Peak flavor development", "Optimal harvest timing"],
      },
      day_6: {
        stage: "harvest_stage",
        germination_rate: 0.95,
        typical_features: ["peak_flavor", "optimal_harvest"],
        sample_count: 40,
        success_rate: 0.95,
        temperature_range: [16, 20],
        humidity_range: [55, 65],
        annotations: ["Maximum spiciness and flavor", "Best texture for consumption"],
      },
    },
    "Pea Shoots": {
      day_1: {
        stage: "seed",
        germination_rate: 0,
        typical_features: ["large_seeds", "soaking_phase"],
        sample_count: 38,
        success_rate: 0.88,
        temperature_range: [18, 22],
        humidity_range: [80, 90],
        annotations: ["Large seeds require longer germination period", "Pre-soaking recommended"],
      },
      day_2: {
        stage: "sprouting",
        germination_rate: 0.1,
        typical_features: ["root_emergence", "slow_start"],
        sample_count: 36,
        success_rate: 0.86,
        temperature_range: [19, 23],
        humidity_range: [85, 95],
        annotations: ["Slower initial germination compared to other varieties"],
      },
      day_3: {
        stage: "early_germination",
        germination_rate: 0.3,
        typical_features: ["cotyledon_emergence", "thick_stems"],
        sample_count: 34,
        success_rate: 0.85,
        temperature_range: [20, 24],
        humidity_range: [80, 90],
        annotations: ["Thick, sturdy stems characteristic of pea shoots"],
      },
      day_4: {
        stage: "active_germination",
        germination_rate: 0.55,
        typical_features: ["rapid_elongation", "pale_green"],
        sample_count: 32,
        success_rate: 0.84,
        temperature_range: [20, 24],
        humidity_range: [75, 85],
        annotations: ["Rapid vertical growth phase begins", "Light green coloration"],
      },
      day_5: {
        stage: "established_seedling",
        germination_rate: 0.7,
        typical_features: ["darker_green", "sturdy_stems"],
        sample_count: 30,
        success_rate: 0.86,
        temperature_range: [19, 23],
        humidity_range: [70, 80],
        annotations: ["Color deepening to darker green", "Very sturdy stem development"],
      },
      day_6: {
        stage: "pre_harvest",
        germination_rate: 0.8,
        typical_features: ["tendrils_forming", "sweet_flavor"],
        sample_count: 28,
        success_rate: 0.87,
        temperature_range: [18, 22],
        humidity_range: [65, 75],
        annotations: ["Tendrils beginning to form", "Sweet flavor developing"],
      },
      day_7: {
        stage: "harvest_stage",
        germination_rate: 0.85,
        typical_features: ["optimal_texture", "peak_sweetness"],
        sample_count: 26,
        success_rate: 0.88,
        temperature_range: [18, 22],
        humidity_range: [60, 70],
        annotations: ["Optimal texture for consumption", "Peak sweetness achieved"],
      },
    },
  }
}

// Create Kaggle API instance only when credentials are available
let kaggleAPIInstance: KaggleAPI | null = null

export function getKaggleAPI(): KaggleAPI | null {
  if (!validateDatasetEnv()) {
    return null
  }

  if (!kaggleAPIInstance) {
    try {
      kaggleAPIInstance = new KaggleAPI()
    } catch (error) {
      console.error("Failed to create Kaggle API instance:", error)
      return null
    }
  }

  return kaggleAPIInstance
}

// Utility functions
export async function getTrainingDataForSeed(seedType: string, dayNumber: number) {
  const trainingData = await getKaggleTrainingData()
  const dayKey = `day_${dayNumber}`
  return trainingData[seedType]?.[dayKey] || null
}

export async function getDatasetStats() {
  try {
    const trainingData = await getKaggleTrainingData()
    const stats = {
      totalSeedTypes: Object.keys(trainingData).length,
      totalSamples: 0,
      avgSuccessRate: 0,
      dataSource: validateDatasetEnv() ? "Kaggle API Ready" : "Fallback Data",
    }

    let totalSuccessRate = 0
    let sampleCount = 0

    Object.values(trainingData).forEach((seedData) => {
      Object.values(seedData).forEach((dayData) => {
        stats.totalSamples += dayData.sample_count
        totalSuccessRate += dayData.success_rate
        sampleCount++
      })
    })

    stats.avgSuccessRate = sampleCount > 0 ? totalSuccessRate / sampleCount : 0

    return stats
  } catch (error) {
    console.error("Error getting dataset stats:", error)
    return {
      totalSeedTypes: 0,
      totalSamples: 0,
      avgSuccessRate: 0,
      dataSource: "Error",
    }
  }
}

// Export validation function
export { validateDatasetEnv }
