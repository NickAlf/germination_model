import { createServerClient } from "@/lib/supabase"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { recordId, stage, notes } = await req.json()

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("germination_records")
      .update({
        current_stage: stage,
        notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", recordId)
      .select()
      .single()

    if (error) throw error

    return Response.json({ success: true, record: data })
  } catch (error) {
    console.error("Update germination record error:", error)
    return Response.json({ error: "Failed to update record" }, { status: 500 })
  }
}
