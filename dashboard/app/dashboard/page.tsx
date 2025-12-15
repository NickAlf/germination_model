"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sprout, Camera, HardDrive, CheckCircle2, AlertCircle, Loader2, Info, ExternalLink } from "lucide-react"
import Image from "next/image"
import { testColabEndpoint } from "@/lib/colab-model"

interface AnalysisResult {
  success: boolean
  source: "colab" | "gpt"
  germinatedCount: number
  totalSeeds: number
  germinationRate: number
  confidence: number
  assessment?: string
}

export default function SimpleDashboard() {
  const [colabEndpoint, setColabEndpoint] = useState("")
  const [useColab, setUseColab] = useState(true)
  const [imageUrl, setImageUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [driveImages, setDriveImages] = useState<any[]>([])
  const [testingEndpoint, setTestingEndpoint] = useState(false)
  const [endpointStatus, setEndpointStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    const saved = localStorage.getItem("colabEndpoint")
    if (saved) setColabEndpoint(saved)
  }, [])

  const saveColabEndpoint = () => {
    localStorage.setItem("colabEndpoint", colabEndpoint)
    alert("Colab endpoint saved!")
  }

  const analyzeImage = async () => {
    if (!imageUrl) {
      setError("Please provide an image URL")
      return
    }

    setAnalyzing(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/analyze-germination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          useColab,
          colabEndpoint: useColab ? colabEndpoint : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setAnalyzing(false)
    }
  }

  const loadDriveImages = async () => {
    const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || ""
    if (!folderId) {
      setError("Drive folder ID not configured")
      return
    }

    setError("Connect your Google Drive API key in environment variables")
  }

  const testEndpoint = async () => {
    if (!colabEndpoint) {
      setError("Please enter a Colab endpoint URL")
      return
    }

    setTestingEndpoint(true)
    setEndpointStatus("idle")

    try {
      const isHealthy = await testColabEndpoint(colabEndpoint)
      setEndpointStatus(isHealthy ? "success" : "error")

      if (!isHealthy) {
        setError("Could not connect to Colab endpoint. Make sure your Colab notebook is running.")
      }
    } catch (err) {
      setEndpointStatus("error")
      setError("Failed to test endpoint")
    } finally {
      setTestingEndpoint(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Germination Dashboard</h1>
              <p className="text-sm text-gray-600">Connect Colab + Drive + ChatGPT</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyze">
              <Camera className="w-4 h-4 mr-2" />
              Analyze Image
            </TabsTrigger>
            <TabsTrigger value="drive">
              <HardDrive className="w-4 h-4 mr-2" />
              Drive Images
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Sprout className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Analysis</CardTitle>
                <CardDescription>
                  {useColab ? "Using your Colab model" : "Using ChatGPT"} for germination detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/seed-image.jpg or Drive link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={analyzeImage} disabled={analyzing} className="flex-1">
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Analyze with {useColab ? "Colab Model" : "ChatGPT"}
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={() => setUseColab(!useColab)}>
                    Switch to {useColab ? "ChatGPT" : "Colab"}
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    <Badge variant={result.source === "colab" ? "default" : "secondary"}>
                      {result.source === "colab" ? "Colab Model" : "ChatGPT"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Germinated Seeds</p>
                      <p className="text-3xl font-bold text-green-600">{result.germinatedCount}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Seeds</p>
                      <p className="text-3xl font-bold text-gray-900">{result.totalSeeds}</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Germination Rate</p>
                      <p className="text-3xl font-bold text-blue-600">{result.germinationRate.toFixed(1)}%</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-3xl font-bold text-purple-600">{(result.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  {result.assessment && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Growth Assessment</p>
                      <p className="text-gray-900">{result.assessment}</p>
                    </div>
                  )}

                  {imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Analyzed Image</p>
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt="Analyzed seed image"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="drive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google Drive Images</CardTitle>
                <CardDescription>Load images from your connected Google Drive folder</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={loadDriveImages}>
                  <HardDrive className="w-4 h-4 mr-2" />
                  Load Drive Images
                </Button>

                {driveImages.length > 0 ? (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {driveImages.map((img) => (
                      <div key={img.id} className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50">
                        <p className="text-sm font-medium truncate">{img.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 text-center py-12 bg-gray-50 rounded-lg">
                    <HardDrive className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No images loaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Colab Model Configuration</CardTitle>
                <CardDescription>Connect your Google Colab hosted germination detection model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Need help?</strong> Check the{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">COLAB_SETUP_GUIDE.md</code> file for
                    complete setup instructions.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="colabEndpoint">Colab Model Endpoint URL</Label>
                  <Input
                    id="colabEndpoint"
                    placeholder="https://abc123.ngrok.io/predict"
                    value={colabEndpoint}
                    onChange={(e) => {
                      setColabEndpoint(e.target.value)
                      setEndpointStatus("idle")
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Enter your Colab notebook's ngrok endpoint URL ending with <code>/predict</code>
                  </p>
                </div>

                {endpointStatus !== "idle" && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      endpointStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {endpointStatus === "success" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Colab endpoint is responding!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Cannot reach Colab endpoint</span>
                      </>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={testEndpoint} variant="outline" disabled={testingEndpoint}>
                    {testingEndpoint ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>

                  <Button onClick={saveColabEndpoint} className="flex-1">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Endpoint
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Quick Setup Steps:</h3>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Open your Colab notebook with the germination model</li>
                    <li>Copy the server code from scripts/colab-model-server.py</li>
                    <li>
                      Install: <code className="bg-gray-100 px-1 rounded">pip install flask flask-cors pyngrok</code>
                    </li>
                    <li>Set your ngrok token and run the server</li>
                    <li>
                      Copy the ngrok URL ending with <code>/predict</code> and paste above
                    </li>
                    <li>Test the connection, then save!</li>
                  </ol>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-900">
                    <strong>First time setup?</strong> Read the complete guide in{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded">COLAB_SETUP_GUIDE.md</code> with step-by-step
                    instructions and troubleshooting tips.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google Drive Configuration</CardTitle>
                <CardDescription>Connect your Google Drive folder with seed images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Drive Folder ID: {process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || "Not configured"}</span>
                </div>

                <p className="text-sm text-gray-600">
                  To configure Google Drive, add{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">GOOGLE_DRIVE_API_KEY</code> and{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_DRIVE_FOLDER_ID</code> to your environment
                  variables
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
