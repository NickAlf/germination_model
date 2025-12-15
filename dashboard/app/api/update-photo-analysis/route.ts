import { createServerClient } from "@/lib/supabase"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { photoId, analysis, modelUsed } = await req.json()

    const supabase = createServerClient()
    const { error } = await supabase
      .from("photo_records")
      .update({
        ai_analysis: analysis,
        ai_model_used: modelUsed,
      })
      .eq("id", photoId)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error("Update analysis error:", error)
    return Response.json({ error: "Failed to update analysis" }, { status: 500 })
  }
}
