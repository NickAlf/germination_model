import { GROWING_RECOMMENDATIONS, SEED_CATEGORIES } from "@/lib/seed-data"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const seedType = searchParams.get("seedType")
    const category = searchParams.get("category")

    if (seedType) {
      // Get specific seed recommendations
      const recommendation = GROWING_RECOMMENDATIONS[seedType as keyof typeof GROWING_RECOMMENDATIONS]

      if (!recommendation) {
        return Response.json({ error: "Seed type not found" }, { status: 404 })
      }

      return Response.json({
        success: true,
        recommendation: {
          seedType,
          ...recommendation,
          category: Object.keys(SEED_CATEGORIES).find((cat) =>
            SEED_CATEGORIES[cat as keyof typeof SEED_CATEGORIES].includes(seedType),
          ),
        },
      })
    }

    if (category) {
      // Get seeds by category
      const seeds = SEED_CATEGORIES[category as keyof typeof SEED_CATEGORIES]

      if (!seeds) {
        return Response.json({ error: "Category not found" }, { status: 404 })
      }

      const recommendations = seeds.map((seed) => ({
        seedType: seed,
        ...GROWING_RECOMMENDATIONS[seed as keyof typeof GROWING_RECOMMENDATIONS],
      }))

      return Response.json({
        success: true,
        category,
        recommendations,
      })
    }

    // Return all recommendations
    return Response.json({
      success: true,
      recommendations: GROWING_RECOMMENDATIONS,
      categories: SEED_CATEGORIES,
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    return Response.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
