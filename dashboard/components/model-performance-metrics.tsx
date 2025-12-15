"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Brain, Zap, Target, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  processingSpeed: number
  confidence: number
  totalPredictions: number
  correctPredictions: number
}

interface ModelComparison {
  model: string
  accuracy: number
  speed: number
  confidence: number
  status: "active" | "training" | "deprecated"
}

interface PerformanceHistory {
  date: string
  accuracy: number
  speed: number
  samples: number
}

export function ModelPerformanceMetrics() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  const [comparisons, setComparisons] = useState<ModelComparison[]>([])
  const [history, setHistory] = useState<PerformanceHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockMetrics: ModelMetrics = {
        accuracy: 94.2,
        precision: 92.8,
        recall: 95.1,
        f1Score: 93.9,
        processingSpeed: 1.8,
        confidence: 89.7,
        totalPredictions: 12470,
        correctPredictions: 11747,
      }

      const mockComparisons: ModelComparison[] = [
        { model: "YOLOv8-Custom", accuracy: 94.2, speed: 1.8, confidence: 89.7, status: "active" },
        { model: "Custom CNN v2", accuracy: 91.5, speed: 2.3, confidence: 87.2, status: "active" },
        { model: "ResNet-50", accuracy: 88.9, speed: 3.1, confidence: 85.6, status: "deprecated" },
        { model: "MobileNet v3", accuracy: 86.7, speed: 1.2, confidence: 82.3, status: "training" },
      ]

      const mockHistory: PerformanceHistory[] = []
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        mockHistory.push({
          date: date.toISOString().split("T")[0],
          accuracy: 90 + Math.random() * 8,
          speed: 1.5 + Math.random() * 1,
          samples: Math.floor(Math.random() * 100) + 50,
        })
      }

      setMetrics(mockMetrics)
      setComparisons(mockComparisons)
      setHistory(mockHistory)
    } catch (error) {
      console.error("Failed to fetch performance data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-800">Accuracy</p>
                <p className="text-xl font-bold text-green-900">{metrics.accuracy}%</p>
              </div>
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-800">Precision</p>
                <p className="text-xl font-bold text-blue-900">{metrics.precision}%</p>
              </div>
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-800">Recall</p>
                <p className="text-xl font-bold text-purple-900">{metrics.recall}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-800">F1 Score</p>
                <p className="text-xl font-bold text-orange-900">{metrics.f1Score}%</p>
              </div>
              <Brain className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-800">Speed</p>
                <p className="text-xl font-bold text-red-900">{metrics.processingSpeed}s</p>
              </div>
              <Zap className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-indigo-800">Confidence</p>
                <p className="text-xl font-bold text-indigo-900">{metrics.confidence}%</p>
              </div>
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance History</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends (30 Days)</CardTitle>
              <CardDescription>Track model accuracy and processing speed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy (%)" />
                  <Line type="monotone" dataKey="speed" stroke="#3B82F6" strokeWidth={2} name="Speed (s)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Volume Trends</CardTitle>
              <CardDescription>Daily sample processing volume and accuracy correlation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="samples"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    name="Daily Samples"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>Compare performance across different AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comparisons}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#10B981" name="Accuracy (%)" />
                  <Bar dataKey="confidence" fill="#3B82F6" name="Confidence (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisons.map((model) => (
                  <div key={model.model} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{model.model}</h4>
                        <p className="text-sm text-gray-500">
                          Accuracy: {model.accuracy}% • Speed: {model.speed}s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          model.status === "active" ? "default" : model.status === "training" ? "secondary" : "outline"
                        }
                      >
                        {model.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">{model.confidence}%</div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Classification Metrics</CardTitle>
                <CardDescription>Detailed performance metrics for seed detection and classification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm font-bold">{metrics.accuracy}%</span>
                    </div>
                    <Progress value={metrics.accuracy} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Precision</span>
                      <span className="text-sm font-bold">{metrics.precision}%</span>
                    </div>
                    <Progress value={metrics.precision} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Recall</span>
                      <span className="text-sm font-bold">{metrics.recall}%</span>
                    </div>
                    <Progress value={metrics.recall} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">F1 Score</span>
                      <span className="text-sm font-bold">{metrics.f1Score}%</span>
                    </div>
                    <Progress value={metrics.f1Score} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Statistics</CardTitle>
                <CardDescription>Real-time processing and prediction statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">{metrics.totalPredictions.toLocaleString()}</div>
                    <div className="text-sm text-green-700">Total Predictions</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">
                      {metrics.correctPredictions.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">Correct Predictions</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Processing Speed</span>
                    <Badge variant="outline">{metrics.processingSpeed}s avg</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Model Confidence</span>
                    <Badge variant="secondary">{metrics.confidence}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Error Rate</span>
                    <Badge variant="destructive">
                      {(
                        ((metrics.totalPredictions - metrics.correctPredictions) / metrics.totalPredictions) *
                        100
                      ).toFixed(1)}
                      %
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
