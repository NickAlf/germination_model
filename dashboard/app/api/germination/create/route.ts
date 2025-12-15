import { createServerClient } from "@/lib/supabase"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId, seedType, expectedDays, notes } = await req.json()

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("germination_records")
      .insert({
        user_id: userId,
        seed_type: seedType,
        planting_date: new Date().toISOString(),
        expected_germination_days: expectedDays,
        current_stage: "planted",
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ success: true, record: data })
  } catch (error) {
    console.error("Create germination record error:", error)
    return Response.json({ error: "Failed to create record" }, { status: 500 })
  }
}
