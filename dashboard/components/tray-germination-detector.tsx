"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, Download, ImageIcon, CheckCircle, XCircle } from "lucide-react"

interface TrayResult {
  trayIndex: number
  germinated: boolean
  greenPercentage: number
  confidence: number
  bbox: number[]
}

interface AnalysisResult {
  success: boolean
  totalTrays: number
  germinatedTrays: number
  notGerminatedTrays: number
  germinationRate: number
  trays: TrayResult[]
  processedImage?: string
  originalImage?: string
  redMarkersFound: boolean
  processingTime: number
}

export default function TrayGerminationDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setAnalysisResult(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze-tray-germination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      setAnalysisResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const exportResults = () => {
    if (!analysisResult) return

    const dataStr = JSON.stringify(analysisResult, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `germination-analysis-${Date.now()}.json`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Upload an image with red marker tapes and trays for germination analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </Button>
            {selectedImage && (
              <Button onClick={analyzeImage} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Analyze Germination
                  </>
                )}
              </Button>
            )}
          </div>

          {selectedImage && (
            <div className="border rounded-lg p-4">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Selected"
                className="w-full h-auto max-h-96 object-contain rounded"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResult && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Germination detection completed in {analysisResult.processingTime.toFixed(2)}s
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{analysisResult.totalTrays}</div>
                  <div className="text-sm text-muted-foreground">Total Trays</div>
                </div>
                <div className="border rounded-lg p-4 text-center bg-green-50">
                  <div className="text-2xl font-bold text-green-600">{analysisResult.germinatedTrays}</div>
                  <div className="text-sm text-muted-foreground">Germinated</div>
                </div>
                <div className="border rounded-lg p-4 text-center bg-red-50">
                  <div className="text-2xl font-bold text-red-600">{analysisResult.notGerminatedTrays}</div>
                  <div className="text-sm text-muted-foreground">Not Germinated</div>
                </div>
                <div className="border rounded-lg p-4 text-center bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">{analysisResult.germinationRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>

              {/* Red Markers Status */}
              <Alert>
                <AlertDescription className="flex items-center gap-2">
                  {analysisResult.redMarkersFound ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Red markers detected - Area masking applied
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-yellow-600" />
                      No red markers found - Using original image
                    </>
                  )}
                </AlertDescription>
              </Alert>

              {/* Individual Tray Results */}
              <div>
                <h3 className="font-semibold mb-3">Individual Tray Analysis</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResult.trays.map((tray) => (
                    <Card key={tray.trayIndex}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Tray {tray.trayIndex + 1}</CardTitle>
                          <Badge variant={tray.germinated ? "default" : "destructive"}>
                            {tray.germinated ? "🌱 Germinated" : "🌰 Not Germinated"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Green Pixels:</span>
                          <span className="font-semibold">{tray.greenPercentage.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="font-semibold">{(tray.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${tray.germinated ? "bg-green-600" : "bg-red-600"}`}
                            style={{ width: `${tray.greenPercentage * 10}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <Button onClick={exportResults} variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Results as JSON
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
