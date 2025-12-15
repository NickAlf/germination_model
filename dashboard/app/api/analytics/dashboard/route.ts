import { createServerClient } from "@/lib/supabase"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get total records
    const { count: totalRecords, error: totalError } = await supabase
      .from("germination_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (totalError) {
      console.error("Total records error:", totalError)
    }

    // Get active records (not mature)
    const { count: activeRecords, error: activeError } = await supabase
      .from("germination_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("current_stage", "mature")

    if (activeError) {
      console.error("Active records error:", activeError)
    }

    // Get photo count - simplified query
    const { data: photoData, error: photoError } = await supabase
      .from("photo_records")
      .select("id")
      .in("germination_record_id", supabase.from("germination_records").select("id").eq("user_id", userId))

    if (photoError) {
      console.error("Photo count error:", photoError)
    }

    const photoCount = photoData?.length || 0

    // Get seed type statistics
    const { data: seedTypeData, error: seedError } = await supabase
      .from("germination_records")
      .select("seed_type")
      .eq("user_id", userId)

    if (seedError) {
      console.error("Seed type error:", seedError)
    }

    const seedTypeStats = (seedTypeData || []).reduce((acc: Record<string, number>, record) => {
      acc[record.seed_type] = (acc[record.seed_type] || 0) + 1
      return acc
    }, {})

    // Calculate success rate (records that reached germinated or mature stage)
    const { data: successData, error: successError } = await supabase
      .from("germination_records")
      .select("current_stage")
      .eq("user_id", userId)
      .in("current_stage", ["germinated", "mature"])

    if (successError) {
      console.error("Success data error:", successError)
    }

    const successRate =
      totalRecords && totalRecords > 0 ? Math.round(((successData?.length || 0) / totalRecords) * 100) : 0

    // Get recent records
    const { data: recentRecords, error: recentError } = await supabase
      .from("germination_records")
      .select(`
        *,
        photo_records (
          id,
          photo_url,
          day_number,
          uploaded_at
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("Recent records error:", recentError)
    }

    return Response.json({
      success: true,
      analytics: {
        totalRecords: totalRecords || 0,
        activeRecords: activeRecords || 0,
        photoCount,
        successRate,
        seedTypeStats,
        recentRecords: recentRecords || [],
      },
    })
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    return Response.json(
      {
        error: "Failed to fetch analytics",
        analytics: {
          totalRecords: 0,
          activeRecords: 0,
          photoCount: 0,
          successRate: 0,
          seedTypeStats: {},
          recentRecords: [],
        },
      },
      { status: 200 },
    ) // Return 200 with fallback data
  }
}
