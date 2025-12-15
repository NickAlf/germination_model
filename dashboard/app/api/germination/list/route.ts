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
    const { data, error } = await supabase
      .from("germination_records")
      .select(`
        *,
        photo_records (
          id,
          photo_url,
          day_number,
          ai_analysis,
          uploaded_at
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return Response.json({ success: true, records: data })
  } catch (error) {
    console.error("List germination records error:", error)
    return Response.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}
