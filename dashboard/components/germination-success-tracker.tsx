"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Thermometer,
  Droplets,
  Target,
  Clock,
  Save,
} from "lucide-react"

interface GerminationProgress {
  id: string
  day_number: number
  actual_germination_rate: number
  predicted_germination_rate: number
  growth_stage: string
  temperature: number
  humidity: number
  notes: string
  prediction_accuracy: number
  status: "on_track" | "ahead" | "behind" | "failed"
  recorded_at: string
}

interface GerminationSuccessTrackerProps {
  germinationRecordId: string
  prediction?: {
    predicted_germination_rate: number
    prediction_timeline: Array<{
      day: number
      expected_germination_rate: number
      stage: string
    }>
  }
}

export function GerminationSuccessTracker({ germinationRecordId, prediction }: GerminationSuccessTrackerProps) {
  const [progress, setProgress] = useState<GerminationProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for new progress entry
  const [dayNumber, setDayNumber] = useState(1)
  const [actualRate, setActualRate] = useState(0)
  const [growthStage, setGrowthStage] = useState("planted")
  const [temperature, setTemperature] = useState(22)
  const [humidity, setHumidity] = useState(70)
  const [notes, setNotes] = useState("")

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/germination-records/${germinationRecordId}`)
      const data = await response.json()

      if (data.success) {
        setProgress(data.progress || [])
      } else {
        setError(data.error || "Failed to fetch progress")
      }
    } catch (err) {
      setError("Failed to fetch germination progress")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const recordProgress = async () => {
    setSaving(true)
    setError(null)

    try {
      const predictedRate =
        prediction?.prediction_timeline.find((t) => t.day === dayNumber)?.expected_germination_rate || 0
      const accuracy = predictedRate > 0 ? Math.max(0, 100 - Math.abs(actualRate - predictedRate)) : 0

      let status: "on_track" | "ahead" | "behind" | "failed" = "on_track"
      if (actualRate === 0 && dayNumber > 10) status = "failed"
      else if (actualRate > predictedRate + 10) status = "ahead"
      else if (actualRate < predictedRate - 15) status = "behind"

      const response = await fetch("/api/record-germination-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          germination_record_id: germinationRecordId,
          day_number: dayNumber,
          actual_germination_rate: actualRate,
          predicted_germination_rate: predictedRate,
          growth_stage: growthStage,
          temperature,
          humidity,
          notes,
          prediction_accuracy: accuracy,
          status,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchProgress()
        // Reset form for next entry
        setDayNumber(dayNumber + 1)
        setActualRate(0)
        setNotes("")
      } else {
        setError(data.error || "Failed to record progress")
      }
    } catch (err) {
      setError("Failed to record progress")
      console.error("Record error:", err)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [germinationRecordId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "ahead":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "behind":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "failed":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on_track":
        return <Target className="w-4 h-4 text-blue-600" />
      case "ahead":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />
      case "behind":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-slate-600" />
    }
  }

  const overallAccuracy =
    progress.length > 0 ? progress.reduce((sum, p) => sum + p.prediction_accuracy, 0) / progress.length : 0

  const latestProgress = progress[progress.length - 1]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-teal-700">
            <Activity className="w-6 h-6 mr-3" />
            Germination Success Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-white/70 border-teal-200">
            <CheckCircle className="h-4 w-4 text-teal-600" />
            <AlertDescription className="text-teal-700">
              Track daily germination progress and validate ML predictions against actual results.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Overall Stats */}
      {progress.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{progress.length}</div>
              <div className="text-sm text-blue-600">Days Tracked</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{latestProgress?.actual_germination_rate || 0}%</div>
              <div className="text-sm text-emerald-600">Current Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{overallAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-purple-600">Prediction Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <Badge className={getStatusColor(latestProgress?.status || "on_track")}>
                {getStatusIcon(latestProgress?.status || "on_track")}
                <span className="ml-1 capitalize">{latestProgress?.status?.replace("_", " ") || "On Track"}</span>
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Record New Progress */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Save className="w-5 h-5 mr-2 text-blue-600" />
            Record Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dayNumber">Day Number</Label>
              <Input
                id="dayNumber"
                type="number"
                value={dayNumber}
                onChange={(e) => setDayNumber(Number.parseInt(e.target.value) || 1)}
                min="1"
                max="30"
              />
            </div>
            <div>
              <Label htmlFor="actualRate">Actual Germination Rate (%)</Label>
              <Input
                id="actualRate"
                type="number"
                value={actualRate}
                onChange={(e) => setActualRate(Number.parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="growthStage">Growth Stage</Label>
              <select
                id="growthStage"
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                <option value="planted">Planted</option>
                <option value="initial_sprouting">Initial Sprouting</option>
                <option value="active_germination">Active Germination</option>
                <option value="established_seedling">Established Seedling</option>
                <option value="mature_seedling">Mature Seedling</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature" className="flex items-center">
                <Thermometer className="w-4 h-4 mr-1" />
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number.parseFloat(e.target.value) || 22)}
                min="0"
                max="50"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="humidity" className="flex items-center">
                <Droplets className="w-4 h-4 mr-1" />
                Humidity (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(Number.parseFloat(e.target.value) || 70)}
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, changes, or other notes..."
              rows={3}
            />
          </div>

          <Button onClick={recordProgress} disabled={saving} className="w-full bg-teal-600 hover:bg-teal-700">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Recording Progress...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Record Day {dayNumber} Progress
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Progress History */}
      {progress.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-slate-600" />
              Progress History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.map((entry, index) => (
                <div key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 font-bold">D{entry.day_number}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700 capitalize">
                          {entry.growth_stage.replace(/_/g, " ")}
                        </h4>
                        <p className="text-sm text-slate-500">{new Date(entry.recorded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(entry.status)}>
                      {getStatusIcon(entry.status)}
                      <span className="ml-1 capitalize">{entry.status.replace("_", " ")}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg font-bold text-emerald-600">{entry.actual_germination_rate}%</div>
                      <div className="text-xs text-slate-500">Actual Rate</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg font-bold text-blue-600">
                        {entry.predicted_germination_rate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">Predicted Rate</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg font-bold text-purple-600">{entry.prediction_accuracy.toFixed(1)}%</div>
                      <div className="text-xs text-slate-500">Accuracy</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-sm font-bold text-slate-600">
                        {entry.temperature}°C / {entry.humidity}%
                      </div>
                      <div className="text-xs text-slate-500">Temp / Humidity</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Prediction Accuracy</span>
                      <span className="font-medium">{entry.prediction_accuracy.toFixed(1)}%</span>
                    </div>
                    <Progress value={entry.prediction_accuracy} className="h-2" />
                  </div>

                  {entry.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
                      <p className="text-sm text-blue-800">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
