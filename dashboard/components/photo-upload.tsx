"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Brain, Camera } from "lucide-react"
import type { GerminationRecord, PhotoRecord, AIModel } from "@/lib/types"

interface PhotoUploadProps {
  record: GerminationRecord
  photos: PhotoRecord[]
  onClose: () => void
  onPhotoUploaded: () => void
}

const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4 Vision",
    provider: "openai",
    model_id: "gpt-4o",
    description: "Advanced vision analysis",
    specialized_for: ["general", "plant-analysis"],
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    model_id: "claude-3-5-sonnet-20241022",
    description: "Detailed visual analysis",
    specialized_for: ["detailed-analysis", "plant-health"],
  },
]

export function PhotoUpload({ record, photos, onClose, onPhotoUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])
  const [dayNumber, setDayNumber] = useState(1)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("germinationRecordId", record.id)
      formData.append("dayNumber", dayNumber.toString())

      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onPhotoUploaded()

      // Auto-analyze the uploaded photo
      await analyzePhoto(data.blobUrl, data.photo.id)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const analyzePhoto = async (imageUrl: string, photoId: string) => {
    setAnalyzing(photoId)
    try {
      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          seedType: record.seed_type,
          dayNumber,
          modelId: selectedModel.model_id,
          provider: selectedModel.provider,
        }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()

      // Update photo record with analysis
      await fetch("/api/update-photo-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId,
          analysis: data.analysis,
          modelUsed: data.modelUsed,
        }),
      })

      onPhotoUploaded() // Refresh photos
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setAnalyzing(null)
    }
  }

  const getDaysPlanted = (plantingDate: string) => {
    const planted = new Date(plantingDate)
    const now = new Date()
    return Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              {record.seed_type} - Photo Documentation
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Badge variant="outline">Day {getDaysPlanted(record.planting_date)}</Badge>
            <Badge className="bg-green-100 text-green-800">{record.current_stage}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="dayNumber">Day Number</Label>
                <Input
                  id="dayNumber"
                  type="number"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(Number.parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="aiModel">AI Analysis Model</Label>
                <Select
                  onValueChange={(value) => setSelectedModel(AI_MODELS.find((m) => m.id === value) || AI_MODELS[0])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="photo-upload"
              />
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">{uploading ? "Uploading..." : "Click to upload photo"}</span>
                </div>
              </Label>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Day {photo.day_number}</Badge>
                      {analyzing === photo.id && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Brain className="w-3 h-3 mr-1" />
                          Analyzing...
                        </Badge>
                      )}
                    </div>
                    <img
                      src={photo.photo_url || "/placeholder.svg"}
                      alt={`Day ${photo.day_number}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {photo.ai_analysis && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Brain className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm font-medium">AI Analysis</span>
                          {photo.ai_model_used && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {photo.ai_model_used}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{photo.ai_analysis}</p>
                      </div>
                    )}
                    {!photo.ai_analysis && !analyzing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => analyzePhoto(photo.photo_url, photo.id)}
                        className="w-full"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Analyze with AI
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No photos uploaded yet. Start documenting your germination process!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
