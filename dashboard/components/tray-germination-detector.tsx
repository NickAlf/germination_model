"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, Download, ImageIcon, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AnalysisResult {
  success: boolean
  source: "colab" | "demo"
  germinatedCount: number
  totalSeeds: number
  germinationRate: number
  confidence: number
  assessment?: string
  probability?: number
  isGerminated?: boolean
}

export default function TrayGerminationDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [colabEndpoint, setColabEndpoint] = useState<string>("")
  const [useColab, setUseColab] = useState(false)

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
      const response = await fetch("/api/analyze-germination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: selectedImage,
          useColab: useColab && colabEndpoint.trim() !== "",
          colabEndpoint: colabEndpoint.trim(),
        }),
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
      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Settings</CardTitle>
          <CardDescription>Connect your GerminationNet model from Colab (optional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useColab"
              checked={useColab}
              onChange={(e) => setUseColab(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="useColab">Use my GerminationNet model from Colab</Label>
          </div>

          {useColab && (
            <div className="space-y-2">
              <Label htmlFor="colabEndpoint">Colab ngrok URL</Label>
              <Input
                id="colabEndpoint"
                type="url"
                placeholder="https://xxxx-xx-xxx-xxx-xx.ngrok-free.app"
                value={colabEndpoint}
                onChange={(e) => setColabEndpoint(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Run the Flask server in your Colab notebook and paste the ngrok URL here
              </p>
            </div>
          )}

          {!useColab && (
            <Alert>
              <AlertDescription className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Using demo data for analysis (connect Colab to use your model)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
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
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Results</CardTitle>
                <Badge variant={analysisResult.source === "colab" ? "default" : "secondary"}>
                  {analysisResult.source === "colab" ? "🔬 Your GerminationNet Model" : "📊 Demo Data"}
                </Badge>
              </div>
              <CardDescription>
                {analysisResult.source === "colab"
                  ? "Analyzed using your custom PyTorch ResNet18 model"
                  : "Showing demo results (connect your Colab model for real analysis)"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{analysisResult.totalSeeds || 1}</div>
                  <div className="text-sm text-muted-foreground">Total Seeds</div>
                </div>
                <div className="border rounded-lg p-4 text-center bg-green-50">
                  <div className="text-2xl font-bold text-green-600">{analysisResult.germinatedCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Germinated</div>
                </div>
                <div className="border rounded-lg p-4 text-center bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">{analysisResult.germinationRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="border rounded-lg p-4 text-center bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">
                    {(analysisResult.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>

              {/* Model-specific details */}
              {analysisResult.source === "colab" && analysisResult.probability !== undefined && (
                <Alert>
                  <AlertDescription className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Model Prediction: {(analysisResult.probability * 100).toFixed(2)}% germination probability
                    {analysisResult.isGerminated ? " (Germinated ✓)" : " (Not Germinated ✗)"}
                  </AlertDescription>
                </Alert>
              )}

              {analysisResult.assessment && (
                <Alert>
                  <AlertDescription>{analysisResult.assessment}</AlertDescription>
                </Alert>
              )}

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
