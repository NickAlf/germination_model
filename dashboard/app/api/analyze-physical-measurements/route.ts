import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return Response.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Simulate AI analysis with realistic seed measurements
    // In production, this would call GPT-4o Vision API
    const measurements = {
      area: Math.random() * 5 + 12, // 12-17
      perimeter: Math.random() * 2 + 14, // 14-16
      compactness: Math.random() * 0.2 + 0.8, // 0.8-1.0
      length_of_kernel: Math.random() * 1.5 + 5.0, // 5.0-6.5
      width_of_kernel: Math.random() * 0.8 + 2.8, // 2.8-3.6
      asymmetry_coefficient: Math.random() * 2 + 1, // 1-3
      length_of_kernel_groove: Math.random() * 1.2 + 4.5, // 4.5-5.7
      confidence: Math.random() * 15 + 85, // 85-100%
    }

    // Dataset averages for wheat varieties (from Seeds Dataset)
    const datasetAverages = {
      Kama: {
        area: 14.88,
        perimeter: 14.57,
        compactness: 0.8811,
        length_of_kernel: 5.554,
        width_of_kernel: 3.333,
        asymmetry_coefficient: 2.691,
        length_of_kernel_groove: 4.825,
      },
      Rosa: {
        area: 18.76,
        perimeter: 16.49,
        compactness: 0.8659,
        length_of_kernel: 6.393,
        width_of_kernel: 3.94,
        asymmetry_coefficient: 3.548,
        length_of_kernel_groove: 5.791,
      },
      Canadian: {
        area: 12.35,
        perimeter: 13.25,
        compactness: 0.8454,
        length_of_kernel: 5.22,
        width_of_kernel: 2.875,
        asymmetry_coefficient: 1.645,
        length_of_kernel_groove: 4.805,
      },
    }

    // Calculate best match
    let bestMatch = "Kama"
    let bestScore = 0

    const varieties = Object.entries(datasetAverages)
    const measurementComparisons = []

    for (const [variety, averages] of varieties) {
      let totalScore = 0
      let measurementCount = 0

      for (const [key, avgValue] of Object.entries(averages)) {
        if (key in measurements && key !== "confidence") {
          const userValue = measurements[key as keyof typeof measurements] as number
          const difference = Math.abs(userValue - avgValue) / avgValue
          const matchPercentage = Math.max(0, (1 - difference) * 100)
          totalScore += matchPercentage
          measurementCount++
        }
      }

      const varietyScore = totalScore / measurementCount
      if (varietyScore > bestScore) {
        bestScore = varietyScore
        bestMatch = variety
      }
    }

    // Generate detailed measurement comparisons for best match
    const bestVariety = datasetAverages[bestMatch as keyof typeof datasetAverages]
    for (const [key, avgValue] of Object.entries(bestVariety)) {
      if (key in measurements && key !== "confidence") {
        const userValue = measurements[key as keyof typeof measurements] as number
        const difference = Math.abs(userValue - avgValue) / avgValue
        const matchPercentage = Math.max(0, (1 - difference) * 100)

        let status: "excellent" | "good" | "fair" | "poor"
        if (matchPercentage >= 90) status = "excellent"
        else if (matchPercentage >= 75) status = "good"
        else if (matchPercentage >= 60) status = "fair"
        else status = "poor"

        measurementComparisons.push({
          measurement: key,
          value: userValue,
          dataset_avg: avgValue,
          match_percentage: matchPercentage,
          status,
        })
      }
    }

    const result = {
      ...measurements,
      dataset_comparison: {
        variety_match: bestMatch,
        match_percentage: bestScore,
        measurements_comparison: measurementComparisons,
      },
    }

    return Response.json({
      success: true,
      measurements: result,
    })
  } catch (error) {
    console.error("Physical measurement analysis error:", error)
    return Response.json({ error: "Failed to analyze physical measurements" }, { status: 500 })
  }
}
