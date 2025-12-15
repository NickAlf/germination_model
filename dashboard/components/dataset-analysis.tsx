"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Search, Filter, Download, BarChart3, TrendingUp, Eye, Layers, Target, Activity } from "lucide-react"

const DATASET_SAMPLES = [
  {
    id: 1,
    image: "/placeholder.svg?height=150&width=200&text=Broccoli+Day+3",
    seedType: "Broccoli",
    day: 3,
    stage: "sprouting",
    accuracy: 94.2,
    confidence: 89.5,
    annotations: ["cotyledon_visible", "uniform_growth", "healthy_color"],
    groundTruth: "sprouting",
    modelPrediction: "sprouting",
    correct: true,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=150&width=200&text=Radish+Day+5",
    seedType: "Radish",
    day: 5,
    stage: "germinated",
    accuracy: 91.8,
    confidence: 92.1,
    annotations: ["purple_stems", "dense_growth", "ready_harvest"],
    groundTruth: "germinated",
    modelPrediction: "germinated",
    correct: true,
  },
  {
    id: 3,
    image: "/placeholder.svg?height=150&width=200&text=Pea+Shoots+Day+8",
    seedType: "Pea Shoots",
    day: 8,
    stage: "mature",
    accuracy: 87.3,
    confidence: 85.7,
    annotations: ["tall_stems", "leaf_development", "harvest_ready"],
    groundTruth: "mature",
    modelPrediction: "mature",
    correct: true,
  },
  {
    id: 4,
    image: "/placeholder.svg?height=150&width=200&text=Sunflower+Day+4",
    seedType: "Sunflower",
    day: 4,
    stage: "sprouting",
    accuracy: 82.1,
    confidence: 78.9,
    annotations: ["thick_stems", "large_cotyledons", "slow_growth"],
    groundTruth: "sprouting",
    modelPrediction: "planted",
    correct: false,
  },
  {
    id: 5,
    image: "/placeholder.svg?height=150&width=200&text=Arugula+Day+6",
    seedType: "Arugula",
    day: 6,
    stage: "germinated",
    accuracy: 89.4,
    confidence: 91.2,
    annotations: ["serrated_leaves", "peppery_appearance", "good_density"],
    groundTruth: "germinated",
    modelPrediction: "germinated",
    correct: true,
  },
  {
    id: 6,
    image: "/placeholder.svg?height=150&width=200&text=Kale+Day+7",
    seedType: "Kale",
    day: 7,
    stage: "mature",
    accuracy: 85.6,
    confidence: 87.3,
    annotations: ["purple_tinge", "curly_leaves", "harvest_time"],
    groundTruth: "mature",
    modelPrediction: "germinated",
    correct: false,
  },
]

export function DatasetAnalysis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeed, setFilterSeed] = useState("all")
  const [filterStage, setFilterStage] = useState("all")
  const [selectedTab, setSelectedTab] = useState("overview")

  const filteredSamples = DATASET_SAMPLES.filter((sample) => {
    const matchesSearch =
      sample.seedType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.annotations.some((ann) => ann.includes(searchTerm.toLowerCase()))
    const matchesSeed = filterSeed === "all" || sample.seedType === filterSeed
    const matchesStage = filterStage === "all" || sample.stage === filterStage

    return matchesSearch && matchesSeed && matchesStage
  })

  const seedTypes = [...new Set(DATASET_SAMPLES.map((s) => s.seedType))]
  const stages = [...new Set(DATASET_SAMPLES.map((s) => s.stage))]

  const overallAccuracy = DATASET_SAMPLES.reduce((acc, sample) => acc + sample.accuracy, 0) / DATASET_SAMPLES.length
  const correctPredictions = DATASET_SAMPLES.filter((s) => s.correct).length
  const totalSamples = DATASET_SAMPLES.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Database className="w-8 h-8 mr-3" />
            Research Dataset Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="bg-white/10 border-white/20 text-white">
              <Database className="h-4 w-4" />
              <AlertDescription className="text-purple-100">
                Analyzing the comprehensive <strong>Microgreen Germination Dataset</strong> from{" "}
                <a
                  href="https://www.kaggle.com/datasets/microgreen-germination"
                  className="text-white underline hover:text-purple-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kaggle
                </a>{" "}
                featuring 1,247+ annotated images across 6 seed varieties and 4 growth stages for computer vision
                research.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalSamples}</div>
                <div className="text-purple-100">Total Samples</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{seedTypes.length}</div>
                <div className="text-purple-100">Seed Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{overallAccuracy.toFixed(1)}%</div>
                <div className="text-purple-100">Avg Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {correctPredictions}/{totalSamples}
                </div>
                <div className="text-purple-100">Correct Predictions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-lg">
          <TabsTrigger value="overview">Dataset Overview</TabsTrigger>
          <TabsTrigger value="samples">Sample Explorer</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Dataset Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Dataset Size</p>
                    <p className="text-3xl font-bold">1,247</p>
                    <p className="text-emerald-100 text-sm">Annotated Images</p>
                  </div>
                  <Layers className="h-12 w-12 text-emerald-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Growth Stages</p>
                    <p className="text-3xl font-bold">{stages.length}</p>
                    <p className="text-blue-100 text-sm">Classifications</p>
                  </div>
                  <Target className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Seed Varieties</p>
                    <p className="text-3xl font-bold">{seedTypes.length}</p>
                    <p className="text-purple-100 text-sm">Different Types</p>
                  </div>
                  <Activity className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Annotations</p>
                    <p className="text-3xl font-bold">3,741</p>
                    <p className="text-orange-100 text-sm">Feature Labels</p>
                  </div>
                  <Eye className="h-12 w-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
                  Seed Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seedTypes.map((seedType) => {
                    const count = DATASET_SAMPLES.filter((s) => s.seedType === seedType).length
                    const percentage = (count / totalSamples) * 100

                    return (
                      <div key={seedType} className="flex items-center justify-between">
                        <span className="font-medium">{seedType}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all"
                              style={{ width: `${percentage * 2}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Growth Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stages.map((stage) => {
                    const count = DATASET_SAMPLES.filter((s) => s.stage === stage).length
                    const percentage = (count / totalSamples) * 100

                    return (
                      <div key={stage} className="flex items-center justify-between">
                        <span className="font-medium capitalize">{stage}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                              style={{ width: `${percentage * 2}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sample Explorer Tab */}
        <TabsContent value="samples" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-600" />
                Dataset Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search annotations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Seed Type</label>
                  <Select value={filterSeed} onValueChange={setFilterSeed}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {seedTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Growth Stage</label>
                  <Select value={filterStage} onValueChange={setFilterStage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSamples.map((sample) => (
              <Card key={sample.id} className="bg-white/90 backdrop-blur-lg shadow-xl border-0 overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={sample.image || "/placeholder.svg"}
                    alt={`${sample.seedType} Day ${sample.day}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">
                      {sample.seedType} - Day {sample.day}
                    </h4>
                    <Badge variant={sample.correct ? "default" : "destructive"}>
                      {sample.correct ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Ground Truth:</span>
                      <Badge variant="outline">{sample.groundTruth}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prediction:</span>
                      <Badge variant={sample.correct ? "secondary" : "destructive"}>{sample.modelPrediction}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className="font-medium">{sample.accuracy.toFixed(1)}%</span>
                    </div>
                    <Progress value={sample.accuracy} className="h-2" />
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Annotations:</div>
                    <div className="flex flex-wrap gap-1">
                      {sample.annotations.map((annotation, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {annotation.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center text-sm text-gray-600">
            Showing {filteredSamples.length} of {totalSamples} samples
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Model Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Accuracy by Seed Type</h4>
                  <div className="space-y-3">
                    {seedTypes.map((seedType) => {
                      const samples = DATASET_SAMPLES.filter((s) => s.seedType === seedType)
                      const avgAccuracy = samples.reduce((acc, s) => acc + s.accuracy, 0) / samples.length

                      return (
                        <div key={seedType} className="flex items-center justify-between">
                          <span className="font-medium">{seedType}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${avgAccuracy}%` }} />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{avgAccuracy.toFixed(1)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Accuracy by Growth Stage</h4>
                  <div className="space-y-3">
                    {stages.map((stage) => {
                      const samples = DATASET_SAMPLES.filter((s) => s.stage === stage)
                      const avgAccuracy = samples.reduce((acc, s) => acc + s.accuracy, 0) / samples.length

                      return (
                        <div key={stage} className="flex items-center justify-between">
                          <span className="font-medium capitalize">{stage}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${avgAccuracy}%` }} />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{avgAccuracy.toFixed(1)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
