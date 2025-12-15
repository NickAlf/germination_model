import { NextResponse } from "next/server"
import { getDatasetInfo, getSeedAnalysisData } from "@/lib/seeds-dataset-api"
import { validateDatasetEnv } from "@/lib/env"

export async function GET() {
  try {
    // Get dataset information
    const datasetInfo = await getDatasetInfo()
    const analysisData = await getSeedAnalysisData()

    // Calculate statistics
    const totalSamples = datasetInfo.total_samples
    const seedTypes = datasetInfo.seed_types
    const avgSuccessRate =
      seedTypes.length > 0
        ? seedTypes.reduce(
            (sum, type) => sum + (analysisData[type]?.germination_characteristics.success_rate || 0),
            0,
          ) / seedTypes.length
        : 0

    return NextResponse.json({
      success: true,
      datasetConnected: validateDatasetEnv(),
      stats: {
        totalSeedTypes: seedTypes.length,
        totalSamples: totalSamples,
        avgSuccessRate: avgSuccessRate,
        dataSource: datasetInfo.source,
      },
      seedTypes: seedTypes,
      sampleStructure: {
        seedType: seedTypes[0] || "Kama",
        characteristics: analysisData[seedTypes[0]]?.germination_characteristics || null,
        sampleGrowthStages: Object.keys(analysisData[seedTypes[0]]?.growth_stages || {}).slice(0, 3),
      },
      datasetUrl: datasetInfo.dataset_url,
      lastUpdated: datasetInfo.last_updated,
      fallbackActive: datasetInfo.source === "Fallback Data",
    })
  } catch (error) {
    console.error("Dataset info API error:", error)

    // Return error response with fallback data
    return NextResponse.json({
      success: false,
      datasetConnected: false,
      stats: {
        totalSeedTypes: 3,
        totalSamples: 210,
        avgSuccessRate: 0.89,
        dataSource: "Error - Using Fallback",
      },
      seedTypes: ["Kama", "Rosa", "Canadian"],
      sampleStructure: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      fallbackActive: true,
    })
  }
}
