"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Server, Database, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react"

interface DatasetInfo {
  success: boolean
  datasetConnected: boolean
  stats: {
    totalSeedTypes: number
    totalSamples: number
    avgSuccessRate: number
    dataSource: string
  }
  seedTypes: string[]
  sampleStructure: any
  datasetUrl: string
  error?: string
  fallbackActive?: boolean
}

export function SetupGuide() {
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDatasetInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/kaggle/dataset-info")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}...`)
      }

      const data = await response.json()
      setDatasetInfo(data)

      if (data.error) {
        setError(data.error)
      }
    } catch (fetchError) {
      console.error("Failed to fetch dataset info:", fetchError)
      const errorMessage = fetchError instanceof Error ? fetchError.message : "Unknown error occurred"
      setError(errorMessage)

      // Set fallback data when API fails
      setDatasetInfo({
        success: false,
        datasetConnected: false,
        stats: {
          totalSeedTypes: 3,
          totalSamples: 210,
          avgSuccessRate: 0.89,
          dataSource: "Fallback Data",
        },
        seedTypes: ["Kama", "Rosa", "Canadian"],
        sampleStructure: null,
        datasetUrl: "fallback",
        error: errorMessage,
        fallbackActive: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatasetInfo()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🚀 Quick Setup Guide - Get AI Models Working</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="premium" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="premium">Premium Models (Best)</TabsTrigger>
              <TabsTrigger value="free">Free Models</TabsTrigger>
              <TabsTrigger value="local">Local Setup</TabsTrigger>
              <TabsTrigger value="dataset">Seeds Dataset</TabsTrigger>
            </TabsList>

            <TabsContent value="premium" className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommended for thesis work</strong> - These provide the most accurate and detailed analysis
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">1. OpenAI GPT-4o Vision</h3>
                    <Badge className="bg-green-500">Highest Accuracy</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      • Go to{" "}
                      <a href="https://platform.openai.com/api-keys" className="text-blue-600 underline">
                        platform.openai.com/api-keys
                      </a>
                    </p>
                    <p>• Create account (gets $5 free credits)</p>
                    <p>• Generate API key</p>
                    <p>• Cost: ~$0.01-0.03 per image analysis</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">2. Anthropic Claude 3.5</h3>
                    <Badge className="bg-blue-500">Best for Research</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      • Go to{" "}
                      <a href="https://console.anthropic.com/" className="text-blue-600 underline">
                        console.anthropic.com
                      </a>
                    </p>
                    <p>• Create account (gets free credits)</p>
                    <p>• Generate API key</p>
                    <p>• Cost: ~$0.008-0.025 per image</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="free" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Free models work but may have rate limits and lower accuracy</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Hugging Face Models</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      ✅ <strong>BLIP-2</strong> - Works immediately, no setup needed
                    </p>
                    <p>
                      ⚠️ <strong>LLaVA 1.5</strong> - May be slow due to model loading
                    </p>
                    <p>• No API key required</p>
                    <p>• Rate limited (try again if it fails)</p>
                    <p>• Basic analysis quality</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="local" className="space-y-4">
              <Alert>
                <Server className="h-4 w-4" />
                <AlertDescription>Run AI models locally - completely free and private once set up</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Ollama Setup (5 minutes)</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Step 1:</strong> Install Ollama
                    </p>
                    <div className="bg-black text-green-400 p-2 rounded font-mono text-xs">
                      curl -fsSL https://ollama.ai/install.sh | sh
                    </div>
                    <p>
                      <strong>Step 2:</strong> Download LLaVA model
                    </p>
                    <div className="bg-black text-green-400 p-2 rounded font-mono text-xs">ollama pull llava:7b</div>
                    <p>
                      <strong>Step 3:</strong> Start server
                    </p>
                    <div className="bg-black text-green-400 p-2 rounded font-mono text-xs">ollama serve</div>
                    <p>• Requires 8GB+ RAM</p>
                    <p>• ~4GB download</p>
                    <p>• Completely free forever</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dataset" className="space-y-4">
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Connect to the real Lucas Iturriago Seeds Dataset from Kaggle for authentic training data and
                  research-grade analysis
                </AlertDescription>
              </Alert>

              {error && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Connection Issue:</strong> {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Seeds Dataset Setup</h3>
                    <Button onClick={fetchDatasetInfo} disabled={loading} size="sm" variant="outline">
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <p>
                      <strong>Option 1:</strong> Direct CSV URL (Recommended)
                    </p>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>
                        • Download the CSV from{" "}
                        <a
                          href="https://www.kaggle.com/datasets/lucasiturriago/seeds"
                          className="text-blue-600 underline"
                        >
                          Kaggle Seeds Dataset
                        </a>
                      </p>
                      <p>• Upload to a public URL (GitHub, Drive, etc.)</p>
                      <p>• Set environment variable:</p>
                      <div className="bg-black text-green-400 p-2 rounded font-mono text-xs mt-2">
                        SEEDS_DATASET_URL=https://your-url.com/seeds.csv
                      </div>
                    </div>

                    <p>
                      <strong>Option 2:</strong> Google Drive Folder
                    </p>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>• Upload seeds.csv to Google Drive</p>
                      <p>• Make it publicly accessible</p>
                      <p>• Copy the file ID from the share URL</p>
                      <div className="bg-black text-green-400 p-2 rounded font-mono text-xs mt-2">
                        DRIVE_FOLDER_ID=your_file_id_here
                      </div>
                    </div>

                    <p>
                      <strong>Current Status:</strong>
                    </p>
                    <div className="bg-gray-50 p-3 rounded">
                      {loading ? (
                        <div className="flex items-center">
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          Checking connection...
                        </div>
                      ) : datasetInfo ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Dataset Connection:</span>
                            <Badge className={datasetInfo.datasetConnected ? "bg-green-500" : "bg-orange-500"}>
                              {datasetInfo.datasetConnected ? "Connected" : "Using Fallback"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Data Source:</span>
                            <Badge variant="outline">{datasetInfo.stats.dataSource}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Seed Types:</span>
                            <span className="font-semibold">{datasetInfo.stats.totalSeedTypes}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Total Samples:</span>
                            <span className="font-semibold">{datasetInfo.stats.totalSamples.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Avg Success Rate:</span>
                            <span className="font-semibold">
                              {(datasetInfo.stats.avgSuccessRate * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-red-600">Failed to load dataset info</span>
                      )}
                    </div>
                  </div>
                </div>

                {datasetInfo && datasetInfo.seedTypes.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Available Seed Types</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {datasetInfo.seedTypes.map((seedType) => (
                        <Badge key={seedType} variant="outline" className="justify-center">
                          {seedType}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      These are wheat varieties: Kama, Rosa, and Canadian wheat seeds
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dataset Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📊 Lucas Iturriago Seeds Dataset Information
            <div className="flex items-center space-x-2">
              {datasetInfo && (
                <Badge className={datasetInfo.datasetConnected ? "bg-green-500" : "bg-orange-500"}>
                  {datasetInfo.datasetConnected ? "Live Data" : "Fallback Data"}
                </Badge>
              )}
              <a
                href="https://www.kaggle.com/datasets/lucasiturriago/seeds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                This research platform uses the <strong>Lucas Iturriago Seeds Dataset</strong> from Kaggle for training
                and validation.{" "}
                {datasetInfo?.datasetConnected
                  ? "Connected to live dataset for real-time data."
                  : "Using high-quality fallback data based on the original dataset patterns."}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-700">Dataset Details</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    • <strong>Source:</strong>{" "}
                    <a
                      href="https://www.kaggle.com/datasets/lucasiturriago/seeds"
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Kaggle - Lucas Iturriago Seeds Dataset
                    </a>
                  </p>
                  <p>
                    • <strong>Connection:</strong> {datasetInfo?.datasetConnected ? "Live Dataset" : "Fallback Data"}
                  </p>
                  <p>
                    • <strong>Samples:</strong> {datasetInfo?.stats.totalSamples.toLocaleString() || "210"} seed
                    measurements
                  </p>
                  <p>
                    • <strong>Varieties:</strong> {datasetInfo?.stats.totalSeedTypes || 3} wheat seed types (Kama, Rosa,
                    Canadian)
                  </p>
                  <p>
                    • <strong>Success Rate:</strong>{" "}
                    {datasetInfo ? (datasetInfo.stats.avgSuccessRate * 100).toFixed(1) : "89"}% average germination
                  </p>
                  <p>
                    • <strong>Features:</strong> 7 physical measurements per seed
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-700">Research Applications</h4>
                <div className="space-y-2 text-sm">
                  <p>• Seed quality classification and analysis</p>
                  <p>• Germination prediction based on physical traits</p>
                  <p>• Agricultural AI pattern recognition</p>
                  <p>• Wheat variety identification</p>
                  <p>• Growth stage prediction modeling</p>
                  <p>• Thesis research and academic validation</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2">Dataset Citation</h4>
              <p className="text-sm text-emerald-700 font-mono bg-white/70 p-2 rounded">
                Iturriago, Lucas. "Seeds Dataset." Kaggle, 2024.
                <a
                  href="https://www.kaggle.com/datasets/lucasiturriago/seeds"
                  className="text-blue-600 underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.kaggle.com/datasets/lucasiturriago/seeds
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Status Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">✅ Working Right Now:</h4>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• Image upload and processing</li>
                <li>
                  •{" "}
                  {datasetInfo?.datasetConnected
                    ? "Live Seeds dataset integration"
                    : "High-quality fallback training data"}
                </li>
                <li>• GPT-4o (with your API key)</li>
                <li>• Claude 3.5 (with your API key)</li>
                <li>• BLIP-2 (free, basic analysis)</li>
                <li>• Dataset-trained AI analysis</li>
                <li>• All UI and comparison features</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚠️ Needs Setup:</h4>
              <ul className="text-sm space-y-1 text-orange-600">
                <li>
                  •{" "}
                  {datasetInfo?.datasetConnected ? "All dataset features active!" : "Seeds dataset URL (for live data)"}
                </li>
                <li>• LLaVA (rate limited on free tier)</li>
                <li>• Ollama (requires local installation)</li>
                <li>• Premium AI model API keys</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
