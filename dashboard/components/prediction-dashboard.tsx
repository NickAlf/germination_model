"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Target,
  Brain,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"

interface ModelPerformance {
  model_name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  total_predictions: number
  correct_predictions: number
  avg_confidence: number
  processing_time_ms: number
  last_updated: string
}

interface PredictionAccuracy {
  seed_type: string
  total_predictions: number
  successful_predictions: number
  accuracy_rate: number
  avg_predicted_rate: number
  avg_actual_rate: number
  prediction_error: number
  confidence_score: number
}

interface TimeSeriesData {
  date: string
  predictions_made: number
  accuracy_rate: number
  avg_confidence: number
  successful_germinations: number
}

interface DashboardData {
  model_performance: ModelPerformance[]
  prediction_accuracy: PredictionAccuracy[]
  time_series: TimeSeriesData[]
  overall_stats: {
    total_predictions: number
    overall_accuracy: number
    best_performing_model: string
    avg_processing_time: number
    total_successful_germinations: number
  }
}

export function PredictionDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/model-performance/dashboard")
      const result = await response.json()

      if (result.error) {
        setError(result.error)
      } else {
        setData(result.data)
        setError(null)
      }
    } catch (err) {
      setError("Failed to fetch dashboard data")
      console.error("Dashboard error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200"
    if (accuracy >= 80) return "text-blue-600 bg-blue-50 border-blue-200"
    if (accuracy >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getPerformanceIcon = (accuracy: number) => {
    if (accuracy >= 90) return <Award className="w-5 h-5 text-emerald-600" />
    if (accuracy >= 80) return <CheckCircle className="w-5 h-5 text-blue-600" />
    if (accuracy >= 70) return <Clock className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600">Loading model performance data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No performance data available</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Model Performance Dashboard</h2>
          <p className="text-slate-600 mt-2">Real-time analytics and accuracy metrics for ML prediction models</p>
        </div>
        <Button onClick={fetchDashboardData} disabled={refreshing} className="bg-blue-600 hover:bg-blue-700">
          {refreshing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh Data
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Total Predictions</p>
                <p className="text-3xl font-bold text-blue-900">
                  {data.overall_stats.total_predictions.toLocaleString()}
                </p>
              </div>
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium">Overall Accuracy</p>
                <p className="text-3xl font-bold text-emerald-900">{data.overall_stats.overall_accuracy.toFixed(1)}%</p>
              </div>
              <Target className="h-12 w-12 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">Best Model</p>
                <p className="text-lg font-bold text-purple-900">{data.overall_stats.best_performing_model}</p>
              </div>
              <Award className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-sm font-medium">Avg Processing</p>
                <p className="text-2xl font-bold text-orange-900">{data.overall_stats.avg_processing_time}ms</p>
              </div>
              <Zap className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-700 text-sm font-medium">Successful</p>
                <p className="text-2xl font-bold text-teal-900">{data.overall_stats.total_successful_germinations}</p>
              </div>
              <Activity className="h-12 w-12 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100">
          <TabsTrigger value="models" className="data-[state=active]:bg-white">
            Model Performance
          </TabsTrigger>
          <TabsTrigger value="accuracy" className="data-[state=active]:bg-white">
            Prediction Accuracy
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-white">
            Performance Trends
          </TabsTrigger>
        </TabsList>

        {/* Model Performance Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Brain className="w-6 h-6 mr-3 text-blue-600" />
                AI Model Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.model_performance.map((model, index) => (
                  <div
                    key={model.model_name}
                    className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            index === 0
                              ? "bg-gradient-to-br from-blue-500 to-blue-600"
                              : index === 1
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                                : index === 2
                                  ? "bg-gradient-to-br from-purple-500 to-purple-600"
                                  : "bg-gradient-to-br from-orange-500 to-orange-600"
                          }`}
                        >
                          {getPerformanceIcon(model.accuracy)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{model.model_name}</h4>
                          <p className="text-sm text-slate-600">
                            {model.total_predictions} predictions • Updated{" "}
                            {new Date(model.last_updated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900">{model.accuracy.toFixed(1)}%</div>
                        <div className="text-sm text-slate-500">Accuracy</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Precision</span>
                          <span className="text-sm text-slate-600">{model.precision.toFixed(1)}%</span>
                        </div>
                        <Progress value={model.precision} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Recall</span>
                          <span className="text-sm text-slate-600">{model.recall.toFixed(1)}%</span>
                        </div>
                        <Progress value={model.recall} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">F1 Score</span>
                          <span className="text-sm text-slate-600">{model.f1_score.toFixed(1)}%</span>
                        </div>
                        <Progress value={model.f1_score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Confidence</span>
                          <span className="text-sm text-slate-600">{model.avg_confidence.toFixed(1)}%</span>
                        </div>
                        <Progress value={model.avg_confidence} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-4">
                        <Badge className={getAccuracyColor(model.accuracy)}>
                          {model.correct_predictions}/{model.total_predictions} Correct
                        </Badge>
                        <Badge variant="outline" className="text-slate-600">
                          {model.processing_time_ms}ms avg
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prediction Accuracy Tab */}
        <TabsContent value="accuracy" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="w-6 h-6 mr-3 text-emerald-600" />
                Prediction Accuracy by Seed Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.prediction_accuracy.map((accuracy, index) => (
                  <div
                    key={accuracy.seed_type}
                    className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 capitalize">
                            {accuracy.seed_type.replace(/([A-Z])/g, " $1").trim()}
                          </h4>
                          <p className="text-sm text-slate-600">{accuracy.total_predictions} predictions made</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{accuracy.accuracy_rate.toFixed(1)}%</div>
                        <div className="text-sm text-slate-500">Accuracy Rate</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{accuracy.avg_predicted_rate.toFixed(1)}%</div>
                        <div className="text-xs text-slate-600">Avg Predicted Rate</div>
                      </div>
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <div className="text-lg font-bold text-emerald-600">{accuracy.avg_actual_rate.toFixed(1)}%</div>
                        <div className="text-xs text-slate-600">Avg Actual Rate</div>
                      </div>
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{accuracy.prediction_error.toFixed(1)}%</div>
                        <div className="text-xs text-slate-600">Prediction Error</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Accuracy Rate</span>
                        <span className="text-sm text-slate-600">{accuracy.accuracy_rate.toFixed(1)}%</span>
                      </div>
                      <Progress value={accuracy.accuracy_rate} className="h-3" />

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium text-slate-700">Confidence Score</span>
                        <span className="text-sm text-slate-600">{accuracy.confidence_score.toFixed(1)}%</span>
                      </div>
                      <Progress value={accuracy.confidence_score} className="h-3" />
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <Badge className={getAccuracyColor(accuracy.accuracy_rate)}>
                        {accuracy.successful_predictions}/{accuracy.total_predictions} Successful
                      </Badge>
                      <Badge variant="outline" className="text-slate-600">
                        ±{accuracy.prediction_error.toFixed(1)}% error margin
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
                Performance Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.time_series.map((timepoint, index) => (
                  <div
                    key={timepoint.date}
                    className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {new Date(timepoint.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </h4>
                          <p className="text-sm text-slate-600">{timepoint.predictions_made} predictions made</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{timepoint.predictions_made}</div>
                        <div className="text-xs text-slate-600">Predictions</div>
                      </div>
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">{timepoint.accuracy_rate.toFixed(1)}%</div>
                        <div className="text-xs text-slate-600">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{timepoint.avg_confidence.toFixed(1)}%</div>
                        <div className="text-xs text-slate-600">Confidence</div>
                      </div>
                      <div className="text-center p-3 bg-white/70 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{timepoint.successful_germinations}</div>
                        <div className="text-xs text-slate-600">Successful</div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Daily Accuracy</span>
                        <span className="text-sm text-slate-600">{timepoint.accuracy_rate.toFixed(1)}%</span>
                      </div>
                      <Progress value={timepoint.accuracy_rate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
