import { put } from "@vercel/blob"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { env } from "@/lib/env"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const germinationRecordId = (formData.get("germinationRecordId") as string) || "demo-record"
    const dayNumber = Number.parseInt((formData.get("dayNumber") as string) || "1")

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // For demo mode or testing, we can use a placeholder URL if blob token is not available
    if (!env.BLOB_READ_WRITE_TOKEN) {
      console.warn("BLOB_READ_WRITE_TOKEN not found, using placeholder image URL")
      const placeholderUrl = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(
        `${germinationRecordId}-Day-${dayNumber}`,
      )}`

      return Response.json({
        blobUrl: placeholderUrl,
        photo: {
          id: `demo-photo-${Date.now()}`,
          germination_record_id: germinationRecordId,
          photo_url: placeholderUrl,
          day_number: dayNumber,
          uploaded_at: new Date().toISOString(),
        },
      })
    }

    // Upload to Vercel Blob
    const blob = await put(`germination/${germinationRecordId}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // If we have Supabase credentials, save to database
    if (env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createServerClient()
        const { data, error } = await supabase
          .from("photo_records")
          .insert({
            germination_record_id: germinationRecordId,
            photo_url: blob.url,
            day_number: dayNumber,
          })
          .select()
          .single()

        if (error) throw error

        return Response.json({ photo: data, blobUrl: blob.url })
      } catch (dbError) {
        console.error("Database error:", dbError)
        // Fall back to just returning the blob URL
        return Response.json({
          blobUrl: blob.url,
          photo: {
            id: `temp-photo-${Date.now()}`,
            germination_record_id: germinationRecordId,
            photo_url: blob.url,
            day_number: dayNumber,
            uploaded_at: new Date().toISOString(),
          },
        })
      }
    } else {
      // No database, just return the blob URL
      return Response.json({
        blobUrl: blob.url,
        photo: {
          id: `temp-photo-${Date.now()}`,
          germination_record_id: germinationRecordId,
          photo_url: blob.url,
          day_number: dayNumber,
          uploaded_at: new Date().toISOString(),
        },
      })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ error: "Failed to upload photo" }, { status: 500 })
  }
}
