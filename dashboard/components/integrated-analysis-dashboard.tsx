"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhysicalMeasurementAnalysis } from "./physical-measurement-analysis"
import { GerminationPredictionModel } from "./germination-prediction-model"
import { GerminationSuccessTracker } from "./germination-success-tracker"
import { Microscope, Brain, Target, TrendingUp } from "lucide-react"

interface IntegratedAnalysisProps {
  imageUrl: string
  seedType: string
  germinationRecordId: string
}

export function IntegratedAnalysisDashboard({ imageUrl, seedType, germinationRecordId }: IntegratedAnalysisProps) {
  const [measurements, setMeasurements] = useState<any>(null)
  const [prediction, setPrediction] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("measurements")

  const handleMeasurementsComplete = (newMeasurements: any, comparison: any) => {
    setMeasurements(newMeasurements)
    // Auto-advance to prediction tab
    setTimeout(() => setActiveTab("prediction"), 1000)
  }

  const handlePredictionComplete = (newPrediction: any) => {
    setPrediction(newPrediction)
    // Auto-advance to tracking tab
    setTimeout(() => setActiveTab("tracking"), 1000)
  }

  const handleSuccessUpdate = (success: boolean, actualRate: number) => {
    // Could trigger notifications or updates here
    console.log(`Germination ${success ? "successful" : "needs attention"}: ${actualRate}%`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <TrendingUp className="w-7 h-7 mr-3" />
            Complete Seed Analysis & Prediction System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Microscope className="w-6 h-6 text-purple-200" />
              <div>
                <p className="font-semibold">Physical Analysis</p>
                <p className="text-sm text-purple-200">7 key measurements</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-200" />
              <div>
                <p className="font-semibold">ML Prediction</p>
                <p className="text-sm text-purple-200">Success probability</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-purple-200" />
              <div>
                <p className="font-semibold">Success Tracking</p>
                <p className="text-sm text-purple-200">Real-time validation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="measurements" className="flex items-center space-x-2">
            <Microscope className="w-4 h-4" />
            <span>Physical Measurements</span>
            {measurements && <Badge className="ml-2 bg-green-500">✓</Badge>}
          </TabsTrigger>
          <TabsTrigger value="prediction" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Germination Prediction</span>
            {prediction && <Badge className="ml-2 bg-green-500">✓</Badge>}
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Success Tracking</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="measurements" className="mt-6">
          <PhysicalMeasurementAnalysis
            imageUrl={imageUrl}
            seedType={seedType}
            onMeasurementsComplete={handleMeasurementsComplete}
          />
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <GerminationPredictionModel
            seedType={seedType}
            measurements={measurements}
            onPredictionComplete={handlePredictionComplete}
          />
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <GerminationSuccessTracker
            germinationRecordId={germinationRecordId}
            seedType={seedType}
            prediction={prediction}
            onSuccessUpdate={handleSuccessUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Summary Card */}
      {measurements && prediction && (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <TrendingUp className="w-5 h-5 mr-2" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{measurements.confidence.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Measurement Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{prediction.success_probability.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Probability</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {prediction.optimal_conditions.days_to_germination}
                </div>
                <div className="text-sm text-gray-600">Days to Germination</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{prediction.model_accuracy.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Model Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
