"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, TrendingUp, Target, Calendar, Thermometer, Droplets, Zap, AlertTriangle } from "lucide-react"

interface GerminationPrediction {
  success_probability: number
  predicted_germination_rate: number
  optimal_conditions: {
    temperature: [number, number]
    humidity: [number, number]
    days_to_germination: number
  }
  risk_factors: Array<{
    factor: string
    risk_level: "low" | "medium" | "high"
    impact: string
    recommendation: string
  }>
  confidence_score: number
  model_accuracy: number
  prediction_timeline: Array<{
    day: number
    expected_germination_rate: number
    stage: string
    key_indicators: string[]
  }>
}

interface PhysicalMeasurements {
  area: number
  perimeter: number
  compactness: number
  length_of_kernel: number
  width_of_kernel: number
  asymmetry_coefficient: number
  length_of_kernel_groove: number
  confidence: number
}

interface GerminationPredictionProps {
  seedType: string
  measurements?: PhysicalMeasurements
  environmentalConditions?: {
    temperature: number
    humidity: number
  }
  onPredictionComplete?: (prediction: GerminationPrediction) => void
}

export function GerminationPredictionModel({
  seedType,
  measurements,
  environmentalConditions,
  onPredictionComplete,
}: GerminationPredictionProps) {
  const [predicting, setPredicting] = useState(false)
  const [prediction, setPrediction] = useState<GerminationPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setPredicting(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch("/api/predict-germination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seedType,
          measurements,
          environmentalConditions,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setPrediction(data.prediction)
        onPredictionComplete?.(data.prediction)
      }
    } catch (err) {
      setError("Failed to generate germination prediction")
      console.error("Prediction error:", err)
    } finally {
      setPredicting(false)
    }
  }

  // Auto-predict when measurements are available
  useEffect(() => {
    if (measurements && !prediction && !predicting) {
      handlePredict()
    }
  }, [measurements])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSuccessColor = (probability: number) => {
    if (probability >= 80) return "text-green-600"
    if (probability >= 60) return "text-blue-600"
    if (probability >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Brain className="w-6 h-6 mr-3" />
            Germination Success Prediction Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-white/10 border-white/20 text-white">
            <Target className="h-4 w-4" />
            <AlertDescription className="text-blue-100">
              ML model trained on Seeds Dataset predicts germination success for {seedType} seeds based on physical
              measurements and environmental conditions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Prediction Button */}
      {!measurements && (
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={handlePredict}
              disabled={predicting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              size="lg"
            >
              {predicting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-3" />
                  Predict Germination Success
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {prediction && (
        <div className="space-y-6">
          {/* Success Probability */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <TrendingUp className="w-5 h-5 mr-2" />
                Germination Success Prediction
                <Badge className={`ml-3 ${getSuccessColor(prediction.success_probability)} bg-white`}>
                  {prediction.success_probability.toFixed(1)}% Success Rate
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getSuccessColor(prediction.success_probability)}`}>
                    {prediction.success_probability.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Probability</div>
                  <Progress value={prediction.success_probability} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {prediction.predicted_germination_rate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Germination Rate</div>
                  <Progress value={prediction.predicted_germination_rate} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {prediction.optimal_conditions.days_to_germination}
                  </div>
                  <div className="text-sm text-gray-600">Days to Germination</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Optimal Temperature</p>
                    <p className="text-xs text-gray-600">
                      {prediction.optimal_conditions.temperature[0]}°C - {prediction.optimal_conditions.temperature[1]}
                      °C
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Optimal Humidity</p>
                    <p className="text-xs text-gray-600">
                      {prediction.optimal_conditions.humidity[0]}% - {prediction.optimal_conditions.humidity[1]}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                Predicted Germination Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prediction.prediction_timeline.map((timepoint, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">D{timepoint.day}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold capitalize">{timepoint.stage.replace(/_/g, " ")}</h4>
                        <Badge variant="outline">{timepoint.expected_germination_rate.toFixed(1)}% Germinated</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Key indicators: {timepoint.key_indicators.join(", ")}
                      </div>
                      <Progress value={timepoint.expected_germination_rate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Risk Assessment & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prediction.risk_factors.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{risk.factor}</h4>
                      <Badge className={getRiskColor(risk.risk_level)}>{risk.risk_level.toUpperCase()} RISK</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{risk.impact}</p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Recommendation:</strong> {risk.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                Model Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{prediction.model_accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Model Accuracy</div>
                  <Progress value={prediction.model_accuracy} className="mt-2 h-2" />
                  <p className="text-xs text-gray-500 mt-1">Based on Seeds Dataset validation</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{prediction.confidence_score.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Prediction Confidence</div>
                  <Progress value={prediction.confidence_score} className="mt-2 h-2" />
                  <p className="text-xs text-gray-500 mt-1">Confidence in this specific prediction</p>
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
