import { createServerClient } from "@/lib/supabase"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const {
      germination_record_id,
      day_number,
      actual_germination_rate,
      predicted_germination_rate,
      growth_stage,
      temperature,
      humidity,
      notes,
      prediction_accuracy,
      status,
    } = await req.json()

    if (!germination_record_id || day_number === undefined || actual_germination_rate === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Insert progress record
    const { data, error } = await supabase
      .from("germination_progress")
      .insert({
        germination_record_id,
        day_number,
        actual_germination_rate,
        predicted_germination_rate: predicted_germination_rate || 0,
        growth_stage: growth_stage || "planted",
        temperature: temperature || 22,
        humidity: humidity || 70,
        notes: notes || "",
        prediction_accuracy: prediction_accuracy || 0,
        status: status || "on_track",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return Response.json({ error: "Failed to record progress" }, { status: 500 })
    }

    return Response.json({
      success: true,
      progress: data,
    })
  } catch (error) {
    console.error("Record progress error:", error)
    return Response.json({ error: "Failed to record germination progress" }, { status: 500 })
  }
}
