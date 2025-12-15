"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Brain, Database, Target, TrendingUp, CheckCircle, XCircle, Zap, Thermometer, Droplets } from "lucide-react"
import { AI_MODELS } from "@/lib/ai-models"

interface AIAnalysisProps {
  imageUrl: string
  seedType: string
  dayNumber: number
  onAnalysisComplete?: (analysis: string) => void
}

interface DatabaseInsights {
  stage_alignment: string
  germination_benchmark: string
  environmental_conditions: string
  feature_checklist: Array<{
    feature: string
    expected: boolean
    detected: boolean
    confidence: number
  }>
  research_annotations: string[]
  sample_size: number
  database_recommendation: string
}

interface AnalysisResult {
  analysis: string
  modelUsed: string
  databaseInsights?: DatabaseInsights
  trainingData?: {
    stage: string
    germination_rate: number
    success_rate: number
    sample_count: number
    dataSource: string
  }
  confidence?: number
  stage_match?: string
  expected_germination_rate?: number
  success_rate?: number
  environmental_conditions?: {
    temperature: [number, number]
    humidity: [number, number]
  }
}

export function AIAnalysis({ imageUrl, seedType, dayNumber, onAnalysisComplete }: AIAnalysisProps) {
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [selectedProvider, setSelectedProvider] = useState("openai")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")

  const handleAnalyze = async () => {
    if (!imageUrl) return

    setAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      // Use the Kaggle dataset-informed analysis endpoint
      const response = await fetch("/api/ai/analyze-with-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          seedType,
          dayNumber,
          modelId: selectedModel,
          provider: selectedProvider,
          apiKey: apiKey || undefined,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setResult({
          analysis: data.analysis,
          modelUsed: `${selectedProvider}:${selectedModel}`,
          trainingData: data.trainingData,
        })
      } else {
        setResult(data)
        onAnalysisComplete?.(data.analysis)
      }
    } catch (err) {
      setError("Failed to analyze image")
      console.error("Analysis error:", err)
    } finally {
      setAnalyzing(false)
    }
  }

  const selectedModelInfo = AI_MODELS.find((m) => m.id === selectedModel)
  const requiresApiKey = selectedModelInfo?.requiresApiKey && selectedModelInfo?.cost === "paid"

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Database className="w-6 h-6 mr-3" />
            Kaggle Dataset-Trained AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-white/10 border-white/20 text-white">
            <Brain className="h-4 w-4" />
            <AlertDescription className="text-blue-100">
              AI models trained on real Kaggle seed germination dataset will analyze your {seedType} microgreen photo
              from day {dayNumber}, comparing against thousands of real samples and providing research-grade insights.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Model Selection */}
      <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Select Kaggle-Trained AI Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">AI Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="google">Google (Gemini)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Model Version</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider === "openai" && (
                    <>
                      <SelectItem value="gpt-4o">GPT-4o (Premium)</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Free)</SelectItem>
                    </>
                  )}
                  {selectedProvider === "anthropic" && (
                    <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                  )}
                  {selectedProvider === "google" && (
                    <SelectItem value="gemini-1.5-pro-vision-latest">Gemini 1.5 Pro Vision</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {requiresApiKey && (
            <div>
              <label className="text-sm font-medium mb-2 block">API Key (Optional)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${selectedProvider} API key`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-600 mt-1">Leave empty to use environment variables if configured</p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !imageUrl}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing with Kaggle Training Data...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Analyze with Kaggle-Trained AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Kaggle Dataset Insights */}
          {result.databaseInsights && (
            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-700">
                  <Target className="w-5 h-5 mr-2" />
                  Kaggle Dataset Training Insights
                  {result.trainingData && (
                    <Badge className="ml-2 bg-emerald-500">{result.trainingData.sample_count} Real Samples</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stage Alignment */}
                <div className="bg-white/70 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-emerald-800">Expected Growth Stage</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-emerald-500">{result.stage_match}</Badge>
                      {result.trainingData && <Badge variant="outline">{result.trainingData.dataSource}</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-emerald-700">{result.databaseInsights.stage_alignment}</p>
                </div>

                {/* Germination Benchmark */}
                <div className="bg-white/70 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">Germination Benchmark</h4>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">
                        {((result.expected_germination_rate || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700">{result.databaseInsights.germination_benchmark}</p>
                  <Progress value={(result.expected_germination_rate || 0) * 100} className="mt-2 h-2" />
                </div>

                {/* Environmental Conditions */}
                {result.environmental_conditions && (
                  <div className="bg-white/70 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">Optimal Environmental Conditions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">Temperature</p>
                          <p className="text-xs text-gray-600">
                            {result.environmental_conditions.temperature[0]}°C -{" "}
                            {result.environmental_conditions.temperature[1]}°C
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Humidity</p>
                          <p className="text-xs text-gray-600">
                            {result.environmental_conditions.humidity[0]}% -{" "}
                            {result.environmental_conditions.humidity[1]}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-purple-700 mt-2">{result.databaseInsights.environmental_conditions}</p>
                  </div>
                )}

                {/* Feature Detection */}
                <div className="bg-white/70 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">Feature Detection (vs Kaggle Training Data)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.databaseInsights.feature_checklist.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded">
                        <span className="text-sm capitalize">{feature.feature}</span>
                        <div className="flex items-center space-x-1">
                          {feature.detected ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-xs text-gray-600">
                            {feature.detected ? `${(feature.confidence * 100).toFixed(0)}%` : "Not Found"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Annotations */}
                {result.databaseInsights.research_annotations &&
                  result.databaseInsights.research_annotations.length > 0 && (
                    <div className="bg-white/70 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-2">Research Annotations from Dataset</h4>
                      <div className="space-y-1">
                        {result.databaseInsights.research_annotations.map((annotation, index) => (
                          <p key={index} className="text-sm text-indigo-700 italic">
                            "• {annotation}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Success Rate */}
                {result.success_rate && (
                  <div className="bg-white/70 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">Dataset Success Rate</h4>
                      <Badge className="bg-green-500">{(result.success_rate * 100).toFixed(1)}%</Badge>
                    </div>
                    <Progress value={result.success_rate * 100} className="h-2" />
                    <p className="text-xs text-green-700 mt-1">
                      Based on {result.databaseInsights.sample_size} real samples from Kaggle dataset
                    </p>
                  </div>
                )}

                {/* Kaggle Recommendation */}
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Kaggle Dataset-Informed Recommendation
                  </h4>
                  <p className="text-sm text-purple-700">{result.databaseInsights.database_recommendation}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Result */}
          <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  AI Analysis Result
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{result.modelUsed}</Badge>
                  {result.confidence && (
                    <Badge className="bg-green-500">Confidence: {result.confidence.toFixed(1)}/10</Badge>
                  )}
                  {result.trainingData && <Badge className="bg-blue-500">Kaggle Trained</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Textarea
                  value={result.analysis}
                  readOnly
                  className="min-h-[300px] bg-white border-none resize-none text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
