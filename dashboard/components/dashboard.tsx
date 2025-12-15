"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Camera, Sprout, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { GerminationRecord, PhotoRecord } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { PhotoUpload } from "./photo-upload"
import { GerminationChart } from "./germination-chart"
import { DEMO_GERMINATION_RECORDS, DEMO_PHOTOS } from "@/lib/demo-data"

export function Dashboard({ demoMode }: { demoMode?: boolean }) {
  const { user } = useAuth()
  const [records, setRecords] = useState<GerminationRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<GerminationRecord | null>(null)
  const [photos, setPhotos] = useState<PhotoRecord[]>([])
  const [showNewRecordForm, setShowNewRecordForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newRecord, setNewRecord] = useState({
    seed_type: "",
    expected_germination_days: 7,
    notes: "",
  })

  useEffect(() => {
    if (demoMode) {
      // Use demo data
      setRecords(DEMO_GERMINATION_RECORDS)
      setLoading(false)
    } else if (user) {
      fetchRecords()
    }
  }, [user, demoMode])

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("germination_records")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPhotos = async (recordId: string) => {
    if (demoMode) {
      // Use demo photos
      const demoPhotos = DEMO_PHOTOS.filter((photo) => photo.germination_record_id === recordId)
      setPhotos(demoPhotos)
      return
    }

    try {
      const { data, error } = await supabase
        .from("photo_records")
        .select("*")
        .eq("germination_record_id", recordId)
        .order("day_number", { ascending: true })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error("Error fetching photos:", error)
    }
  }

  const createRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from("germination_records")
        .insert({
          ...newRecord,
          user_id: user?.id,
          planting_date: new Date().toISOString(),
          current_stage: "planted",
        })
        .select()
        .single()

      if (error) throw error

      setRecords([data, ...records])
      setNewRecord({ seed_type: "", expected_germination_days: 7, notes: "" })
      setShowNewRecordForm(false)
    } catch (error) {
      console.error("Error creating record:", error)
    }
  }

  const updateStage = async (recordId: string, stage: string) => {
    try {
      const { error } = await supabase
        .from("germination_records")
        .update({ current_stage: stage, updated_at: new Date().toISOString() })
        .eq("id", recordId)

      if (error) throw error

      setRecords(records.map((r) => (r.id === recordId ? { ...r, current_stage: stage as any } : r)))
    } catch (error) {
      console.error("Error updating stage:", error)
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "planted":
        return "bg-gray-500"
      case "sprouting":
        return "bg-yellow-500"
      case "germinated":
        return "bg-green-500"
      case "mature":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDaysPlanted = (plantingDate: string) => {
    const planted = new Date(plantingDate)
    const now = new Date()
    return Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {demoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode Active</h3>
              <p className="text-sm text-blue-700">
                You're viewing sample data with pre-populated germination records and AI analyses. All features are
                fully functional - try uploading photos, updating stages, and exploring the admin panel!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Germination Dashboard</h1>
        <Button onClick={() => setShowNewRecordForm(true)}>
          <Sprout className="w-4 h-4 mr-2" />
          New Record
        </Button>
      </div>

      {showNewRecordForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Germination Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createRecord} className="space-y-4">
              <div>
                <Label htmlFor="seed_type">Seed Type</Label>
                <Input
                  id="seed_type"
                  value={newRecord.seed_type}
                  onChange={(e) => setNewRecord({ ...newRecord, seed_type: e.target.value })}
                  placeholder="e.g., Broccoli, Radish, Pea Shoots"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expected_days">Expected Germination Days</Label>
                <Input
                  id="expected_days"
                  type="number"
                  value={newRecord.expected_germination_days}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, expected_germination_days: Number.parseInt(e.target.value) })
                  }
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  placeholder="Growing conditions, seed source, etc."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Record</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewRecordForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <Card key={record.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{record.seed_type}</CardTitle>
                <Badge className={getStageColor(record.current_stage)}>{record.current_stage}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Day {getDaysPlanted(record.planting_date)} of {record.expected_germination_days}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedRecord(record)
                      fetchPhotos(record.id)
                    }}
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Photos
                  </Button>
                  <Select onValueChange={(value) => updateStage(record.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Update Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planted">Planted</SelectItem>
                      <SelectItem value="sprouting">Sprouting</SelectItem>
                      <SelectItem value="germinated">Germinated</SelectItem>
                      <SelectItem value="mature">Mature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRecord && (
        <PhotoUpload
          record={selectedRecord}
          photos={photos}
          onClose={() => setSelectedRecord(null)}
          onPhotoUploaded={() => fetchPhotos(selectedRecord.id)}
        />
      )}

      {records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Germination Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GerminationChart records={records} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
