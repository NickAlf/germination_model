"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Zap, Target, Clock, DollarSign, Brain, BarChart3, Play } from "lucide-react"
import { AI_MODELS, FREE_MODELS, PAID_MODELS } from "@/lib/ai-models"

interface ModelPerformance {
  accuracy: number
  speed: number
  cost: number
  reliability: number
  specialization: number
}

const MODEL_PERFORMANCE: Record<string, ModelPerformance> = {
  "gpt-4o": { accuracy: 94, speed: 85, cost: 30, reliability: 96, specialization: 92 },
  "claude-3-5-sonnet": { accuracy: 91, speed: 80, cost: 35, reliability: 94, specialization: 89 },
  "gemini-pro-vision": { accuracy: 88, speed: 90, cost: 60, reliability: 87, specialization: 85 },
  "huggingface-llava": { accuracy: 87, speed: 70, cost: 100, reliability: 82, specialization: 80 },
  "huggingface-blip2": { accuracy: 82, speed: 95, cost: 100, reliability: 78, specialization: 75 },
  "ollama-llava": { accuracy: 85, speed: 60, cost: 100, reliability: 90, specialization: 83 },
}

export function ModelComparison() {
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4o", "huggingface-llava"])
  const [comparisonType, setComparisonType] = useState("performance")
  const [runningBenchmark, setRunningBenchmark] = useState(false)

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const runBenchmark = async () => {
    setRunningBenchmark(true)
    // Simulate benchmark running
    setTimeout(() => {
      setRunningBenchmark(false)
    }, 3000)
  }

  const getModelById = (id: string) => AI_MODELS.find((m) => m.id === id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl">
            <Settings className="w-6 h-6 mr-2" />
            AI Model Testing Laboratory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              Compare different AI models for germination analysis. Test accuracy, speed, and cost-effectiveness across
              various computer vision models to find the optimal solution for your research.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs value={comparisonType} onValueChange={setComparisonType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="benchmark">Live Benchmark</TabsTrigger>
          <TabsTrigger value="recommendations">Model Recommendations</TabsTrigger>
        </TabsList>

        {/* Performance Comparison */}
        <TabsContent value="performance" className="space-y-6">
          {/* Model Selection */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>Select Models to Compare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3 text-green-700">Free Models</h4>
                  <div className="space-y-2">
                    {FREE_MODELS.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                      >
                        <div>
                          <span className="font-medium">{model.name}</span>
                          <p className="text-sm text-gray-600">{model.description}</p>
                        </div>
                        <Button
                          variant={selectedModels.includes(model.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleModel(model.id)}
                        >
                          {selectedModels.includes(model.id) ? "Selected" : "Select"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-blue-700">Premium Models</h4>
                  <div className="space-y-2">
                    {PAID_MODELS.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                      >
                        <div>
                          <span className="font-medium">{model.name}</span>
                          <p className="text-sm text-gray-600">{model.description}</p>
                        </div>
                        <Button
                          variant={selectedModels.includes(model.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleModel(model.id)}
                        >
                          {selectedModels.includes(model.id) ? "Selected" : "Select"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Comparison Chart */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedModels.map((modelId) => {
                  const model = getModelById(modelId)
                  const performance = MODEL_PERFORMANCE[modelId]

                  if (!model || !performance) return null

                  return (
                    <div key={modelId} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">{model.name}</h4>
                        <div className="flex gap-2">
                          <Badge variant={model.cost === "free" ? "secondary" : "default"}>
                            {model.cost === "free" ? "Free" : "Premium"}
                          </Badge>
                          <Badge variant="outline">{model.provider}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Target className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-sm font-medium">Accuracy</span>
                          </div>
                          <Progress value={performance.accuracy} className="h-2 mb-1" />
                          <span className="text-xs text-gray-600">{performance.accuracy}%</span>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <Zap className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm font-medium">Speed</span>
                          </div>
                          <Progress value={performance.speed} className="h-2 mb-1" />
                          <span className="text-xs text-gray-600">{performance.speed}%</span>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <DollarSign className="w-4 h-4 mr-2 text-orange-600" />
                            <span className="text-sm font-medium">Cost Efficiency</span>
                          </div>
                          <Progress value={performance.cost} className="h-2 mb-1" />
                          <span className="text-xs text-gray-600">{performance.cost}%</span>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <Clock className="w-4 h-4 mr-2 text-purple-600" />
                            <span className="text-sm font-medium">Reliability</span>
                          </div>
                          <Progress value={performance.reliability} className="h-2 mb-1" />
                          <span className="text-xs text-gray-600">{performance.reliability}%</span>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <Brain className="w-4 h-4 mr-2 text-red-600" />
                            <span className="text-sm font-medium">Plant Analysis</span>
                          </div>
                          <Progress value={performance.specialization} className="h-2 mb-1" />
                          <span className="text-xs text-gray-600">{performance.specialization}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Benchmark */}
        <TabsContent value="benchmark" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Live Model Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button
                  onClick={runBenchmark}
                  disabled={runningBenchmark || selectedModels.length === 0}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  size="lg"
                >
                  {runningBenchmark ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Running Benchmark...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Live Benchmark Test
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600 mt-2">Test selected models with sample germination images</p>
              </div>

              {runningBenchmark && (
                <div className="mt-6 space-y-4">
                  {selectedModels.map((modelId, index) => {
                    const model = getModelById(modelId)
                    return (
                      <div key={modelId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">{model?.name}</span>
                        <div className="flex items-center">
                          <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm text-blue-600">Testing...</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">For Research & Thesis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="font-medium text-green-700">Recommended: GPT-4o Vision</div>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• Highest accuracy (94%)</li>
                    <li>• Detailed analysis reports</li>
                    <li>• Excellent for academic work</li>
                    <li>• Professional documentation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">For Budget-Conscious</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="font-medium text-blue-700">Recommended: LLaVA 1.5</div>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Completely free to use</li>
                    <li>• Good accuracy (87%)</li>
                    <li>• Open source model</li>
                    <li>• No API costs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">For Speed & Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="font-medium text-purple-700">Recommended: BLIP-2</div>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>• Fastest processing</li>
                    <li>• Free to use</li>
                    <li>• Good for batch processing</li>
                    <li>• Reliable performance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
