import { createServerClient } from "@/lib/supabase"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return Response.json({ error: "Record ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get germination record with progress
    const { data: record, error: recordError } = await supabase
      .from("germination_records")
      .select(`
        *,
        germination_progress (
          id,
          day_number,
          actual_germination_rate,
          predicted_germination_rate,
          growth_stage,
          temperature,
          humidity,
          notes,
          prediction_accuracy,
          status,
          recorded_at
        )
      `)
      .eq("id", id)
      .single()

    if (recordError) {
      console.error("Database error:", recordError)
      return Response.json({ error: "Failed to fetch record" }, { status: 500 })
    }

    // Sort progress by day number
    const sortedProgress = record.germination_progress?.sort((a: any, b: any) => a.day_number - b.day_number) || []

    return Response.json({
      success: true,
      record: {
        ...record,
        germination_progress: undefined,
      },
      progress: sortedProgress,
    })
  } catch (error) {
    console.error("Get record error:", error)
    return Response.json({ error: "Failed to fetch germination record" }, { status: 500 })
  }
}
