"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Camera, Zap, Target, Eye, BarChart3, Download } from "lucide-react"
import Image from "next/image"

interface DetectionResult {
  seedCount: number
  germinatedCount: number
  germinationPercentage: number
  confidence: number
  detections: Array<{
    id: string
    x: number
    y: number
    width: number
    height: number
    confidence: number
    status: "germinated" | "not_germinated"
    type: string
  }>
  processingTime: number
  imageUrl: string
}

const MICROGREEN_TYPES = [
  "Broccoli",
  "Radish",
  "Pea Shoots",
  "Sunflower",
  "Wheatgrass",
  "Kale",
  "Arugula",
  "Mustard",
  "Cabbage",
  "Alfalfa",
  "Clover",
  "Fenugreek",
  "Cress",
  "Chia",
  "Flax",
]

export function SeedDetectionAnalysis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage || !selectedType) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch("/api/analyze-seed-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          seedType: selectedType,
        }),
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      setTimeout(() => {
        setResult(data)
        setIsAnalyzing(false)
        setAnalysisProgress(0)
      }, 500)
    } catch (error) {
      console.error("Analysis failed:", error)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const downloadResults = () => {
    if (!result) return

    const data = {
      timestamp: new Date().toISOString(),
      seedType: selectedType,
      ...result,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `seed-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-dashed border-2 border-gray-300 hover:border-green-400 transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Upload className="h-5 w-5 text-green-600" />
              <span>Upload Microgreen Image</span>
            </CardTitle>
            <CardDescription>Select a high-quality image of microgreen seeds for analysis</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="lg" className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
            {selectedImage && (
              <div className="mt-4">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected microgreen image"
                  width={300}
                  height={200}
                  className="rounded-lg mx-auto object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Analysis Configuration</span>
            </CardTitle>
            <CardDescription>Configure the detection parameters for optimal results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Microgreen Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select microgreen type" />
                </SelectTrigger>
                <SelectContent>
                  {MICROGREEN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Detection Confidence</span>
                <Badge variant="secondary">85%</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Model Version</span>
                <Badge variant="outline">YOLOv8-Custom</Badge>
              </div>
            </div>

            <Button
              onClick={analyzeImage}
              disabled={!selectedImage || !selectedType || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Analyze Seeds
                </>
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Detection Results</span>
                </div>
                <Button onClick={downloadResults} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Results Summary */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">{result.seedCount}</div>
                      <div className="text-sm text-blue-700">Total Seeds</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">{result.germinatedCount}</div>
                      <div className="text-sm text-green-700">Germinated</div>
                    </div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">{result.germinationPercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-700">Germination Rate</div>
                    <Progress value={result.germinationPercentage} className="mt-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <Badge variant="secondary">{(result.confidence * 100).toFixed(1)}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <Badge variant="outline">{result.processingTime}ms</Badge>
                    </div>
                  </div>
                </div>

                {/* Detection Visualization */}
                <div className="relative">
                  <Image
                    src={selectedImage! || "/placeholder.svg"}
                    alt="Analysis result"
                    width={400}
                    height={300}
                    className="rounded-lg w-full object-cover"
                  />
                  {/* Overlay detection boxes */}
                  <div className="absolute inset-0">
                    {result.detections.map((detection) => (
                      <div
                        key={detection.id}
                        className={`absolute border-2 ${
                          detection.status === "germinated"
                            ? "border-green-400 bg-green-400/20"
                            : "border-red-400 bg-red-400/20"
                        }`}
                        style={{
                          left: `${detection.x}%`,
                          top: `${detection.y}%`,
                          width: `${detection.width}%`,
                          height: `${detection.height}%`,
                        }}
                      >
                        <div
                          className={`absolute -top-6 left-0 text-xs px-1 py-0.5 rounded ${
                            detection.status === "germinated" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}
                        >
                          {(detection.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>Individual seed detection results and confidence scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {result.detections.map((detection, index) => (
                  <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          detection.status === "germinated" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-medium">Seed {index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={detection.status === "germinated" ? "default" : "secondary"}>
                        {detection.status === "germinated" ? "Germinated" : "Not Germinated"}
                      </Badge>
                      <Badge variant="outline">{(detection.confidence * 100).toFixed(1)}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
