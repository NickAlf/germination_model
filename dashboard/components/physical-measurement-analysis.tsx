"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Ruler, Target, CheckCircle, AlertTriangle, Brain, Zap } from "lucide-react"

interface PhysicalMeasurements {
  area: number
  perimeter: number
  compactness: number
  length_of_kernel: number
  width_of_kernel: number
  asymmetry_coefficient: number
  length_of_kernel_groove: number
  confidence: number
  dataset_comparison: {
    variety_match: string
    match_percentage: number
    measurements_comparison: Array<{
      measurement: string
      value: number
      dataset_avg: number
      match_percentage: number
      status: "excellent" | "good" | "fair" | "poor"
    }>
  }
}

interface PhysicalMeasurementAnalysisProps {
  imageUrl?: string
  onAnalysisComplete?: (measurements: PhysicalMeasurements) => void
}

export function PhysicalMeasurementAnalysis({ imageUrl, onAnalysisComplete }: PhysicalMeasurementAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [measurements, setMeasurements] = useState<PhysicalMeasurements | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(imageUrl || null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setMeasurements(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedImage) return

    setAnalyzing(true)
    setError(null)
    setMeasurements(null)

    try {
      const response = await fetch("/api/analyze-physical-measurements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setMeasurements(data.measurements)
        onAnalysisComplete?.(data.measurements)
      }
    } catch (err) {
      setError("Failed to analyze physical measurements")
      console.error("Analysis error:", err)
    } finally {
      setAnalyzing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "fair":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "poor":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "good":
        return <Target className="w-4 h-4 text-blue-600" />
      case "fair":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "poor":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Ruler className="w-4 h-4 text-slate-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-emerald-700">
            <Ruler className="w-6 h-6 mr-3" />
            Physical Measurement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-white/70 border-emerald-200">
            <Brain className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700">
              AI-powered extraction of 7 key physical measurements from seed photos, compared against the Lucas
              Iturriago Seeds Dataset for variety identification and quality assessment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Image Upload */}
      {!uploadedImage && (
        <Card className="border-2 border-dashed border-slate-300 hover:border-emerald-400 transition-colors">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <Upload className="w-16 h-16 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-slate-700">Upload Seed Image</h3>
                <p className="text-slate-500">Upload a clear photo of seeds for physical measurement analysis</p>
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload">
                  <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <span>Choose Image</span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Image */}
      {uploadedImage && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-700">Uploaded Image</h3>
              <div className="space-x-2">
                <Button onClick={handleAnalyze} disabled={analyzing} className="bg-emerald-600 hover:bg-emerald-700">
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Measurements
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedImage(null)
                    setMeasurements(null)
                    setError(null)
                  }}
                >
                  Upload New Image
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="Uploaded seed"
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {measurements && (
        <div className="space-y-6">
          {/* Dataset Comparison */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Target className="w-5 h-5 mr-2" />
                Dataset Comparison Results
                <Badge className="ml-3 bg-white text-blue-700">
                  {measurements.dataset_comparison.match_percentage.toFixed(1)}% Match
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {measurements.dataset_comparison.variety_match}
                </div>
                <div className="text-sm text-slate-600">Best Matching Wheat Variety</div>
                <Progress value={measurements.dataset_comparison.match_percentage} className="mt-3 h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/70 rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">{measurements.confidence.toFixed(1)}%</div>
                  <div className="text-xs text-slate-600">AI Confidence</div>
                </div>
                <div className="text-center p-3 bg-white/70 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {
                      measurements.dataset_comparison.measurements_comparison.filter(
                        (m) => m.status === "excellent" || m.status === "good",
                      ).length
                    }
                    /7
                  </div>
                  <div className="text-xs text-slate-600">Good Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Measurements */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="w-5 h-5 mr-2 text-slate-600" />
                Physical Measurements Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {measurements.dataset_comparison.measurements_comparison.map((measurement, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(measurement.status)}
                        <h4 className="font-semibold text-slate-700 capitalize">
                          {measurement.measurement.replace(/_/g, " ")}
                        </h4>
                      </div>
                      <Badge className={getStatusColor(measurement.status)}>{measurement.status.toUpperCase()}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-lg font-bold text-slate-700">{measurement.value.toFixed(3)}</div>
                        <div className="text-xs text-slate-500">Your Seed</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-lg font-bold text-blue-600">{measurement.dataset_avg.toFixed(3)}</div>
                        <div className="text-xs text-slate-500">Dataset Average</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-lg font-bold text-emerald-600">
                          {measurement.match_percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">Match</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Match Percentage</span>
                        <span className="font-medium">{measurement.match_percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={measurement.match_percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Raw Measurements */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                Raw Measurement Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Area</div>
                  <div className="text-2xl font-bold text-blue-700">{measurements.area.toFixed(3)}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                  <div className="text-sm text-emerald-600 font-medium">Perimeter</div>
                  <div className="text-2xl font-bold text-emerald-700">{measurements.perimeter.toFixed(3)}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Compactness</div>
                  <div className="text-2xl font-bold text-purple-700">{measurements.compactness.toFixed(3)}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Kernel Length</div>
                  <div className="text-2xl font-bold text-orange-700">{measurements.length_of_kernel.toFixed(3)}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                  <div className="text-sm text-teal-600 font-medium">Kernel Width</div>
                  <div className="text-2xl font-bold text-teal-700">{measurements.width_of_kernel.toFixed(3)}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                  <div className="text-sm text-pink-600 font-medium">Asymmetry</div>
                  <div className="text-2xl font-bold text-pink-700">
                    {measurements.asymmetry_coefficient.toFixed(3)}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                  <div className="text-sm text-indigo-600 font-medium">Groove Length</div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {measurements.length_of_kernel_groove.toFixed(3)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
