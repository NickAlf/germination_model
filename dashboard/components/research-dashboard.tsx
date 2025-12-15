"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Database, Target, Zap, Upload, BarChart3, TestTube, Cpu, Eye, Activity } from "lucide-react"

interface DashboardStats {
  totalImages: number
  modelsCompared: number
  testResults: number
  accuracyScore: number
  datasetStats: {
    broccoli: number
    radish: number
    peaShots: number
    sunflower: number
    arugula: number
  }
}

interface ResearchDashboardProps {
  stats: DashboardStats | null
  onTabChange: (tab: string) => void
}

export function ResearchDashboard({ stats, onTabChange }: ResearchDashboardProps) {
  const modelPerformance = [
    { name: "GPT-4o Vision", accuracy: 94.2, speed: 1.2, cost: "$$", specialty: "General Analysis" },
    { name: "Claude 3.5 Sonnet", accuracy: 91.8, speed: 1.8, cost: "$$", specialty: "Detailed Reports" },
    { name: "LLaVA 1.5", accuracy: 87.3, speed: 2.1, cost: "Free", specialty: "Open Source" },
    { name: "BLIP-2", accuracy: 82.1, speed: 0.8, cost: "Free", specialty: "Fast Processing" },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 text-white shadow-2xl border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="relative p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Computer Vision Research Platform</h2>
                <p className="text-emerald-100 text-lg">
                  Advanced AI model comparison for microgreen germination pattern recognition using the comprehensive{" "}
                  <a
                    href="https://www.kaggle.com/datasets/microgreen-germination"
                    className="text-white underline hover:text-emerald-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kaggle Microgreen Dataset
                  </a>{" "}
                  for growth stage classification and agricultural research.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Eye className="w-4 h-4 mr-2" />
                  Computer Vision
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  Machine Learning
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <TestTube className="w-4 h-4 mr-2" />
                  Agricultural Research
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Database className="h-12 w-12 mx-auto mb-3 text-emerald-200" />
                <div className="text-3xl font-bold">{stats?.totalImages.toLocaleString()}</div>
                <div className="text-emerald-100">Images Analyzed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Target className="h-12 w-12 mx-auto mb-3 text-blue-200" />
                <div className="text-3xl font-bold">{stats?.accuracyScore}%</div>
                <div className="text-blue-100">Best Accuracy</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Dataset Size</p>
                <p className="text-3xl font-bold">{stats?.totalImages.toLocaleString()}</p>
                <p className="text-emerald-100 text-sm">Training Images</p>
              </div>
              <Database className="h-12 w-12 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Models Tested</p>
                <p className="text-3xl font-bold">{stats?.modelsCompared}</p>
                <p className="text-blue-100 text-sm">AI Architectures</p>
              </div>
              <Brain className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Test Results</p>
                <p className="text-3xl font-bold">{stats?.testResults}</p>
                <p className="text-purple-100 text-sm">Comparisons Run</p>
              </div>
              <TestTube className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Peak Accuracy</p>
                <p className="text-3xl font-bold">{stats?.accuracyScore}%</p>
                <p className="text-orange-100 text-sm">Best Model Score</p>
              </div>
              <Target className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Research Actions</CardTitle>
          <CardDescription className="text-lg">
            Start testing images with AI models or explore your research dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              onClick={() => onTabChange("testing")}
              className="h-32 flex-col bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg text-white border-0"
            >
              <Upload className="h-12 w-12 mb-3" />
              <span className="text-lg font-semibold">Test Images</span>
              <span className="text-sm opacity-90">Upload & analyze with AI models</span>
            </Button>

            <Button
              onClick={() => onTabChange("benchmark")}
              variant="outline"
              className="h-32 flex-col bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 shadow-lg"
            >
              <Zap className="h-12 w-12 mb-3 text-blue-600" />
              <span className="text-lg font-semibold text-blue-700">Compare Models</span>
              <span className="text-sm text-blue-600">Benchmark AI performance</span>
            </Button>

            <Button
              onClick={() => onTabChange("dataset")}
              variant="outline"
              className="h-32 flex-col bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 shadow-lg"
            >
              <BarChart3 className="h-12 w-12 mb-3 text-purple-600" />
              <span className="text-lg font-semibold text-purple-700">Analyze Dataset</span>
              <span className="text-sm text-purple-600">Explore research data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Model Performance Overview */}
      <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Cpu className="w-6 h-6 mr-3 text-blue-600" />
            AI Model Performance Overview
          </CardTitle>
          <CardDescription className="text-lg">
            Comparative analysis of computer vision models for germination detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {modelPerformance.map((model, index) => (
              <div
                key={model.name}
                className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        index === 0
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                          : index === 1
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : index === 2
                              ? "bg-gradient-to-br from-purple-500 to-purple-600"
                              : "bg-gradient-to-br from-orange-500 to-orange-600"
                      }`}
                    >
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{model.name}</h4>
                      <p className="text-sm text-gray-600">{model.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={model.cost === "Free" ? "secondary" : "default"} className="px-3 py-1">
                      {model.cost === "Free" ? "Free" : "Premium"}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{model.accuracy}%</div>
                      <div className="text-sm text-gray-500">Accuracy</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Accuracy</span>
                      <span className="text-sm text-gray-600">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Speed</span>
                      <span className="text-sm text-gray-600">{model.speed}s</span>
                    </div>
                    <Progress value={100 - model.speed * 20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Cost Efficiency</span>
                      <span className="text-sm text-gray-600">{model.cost}</span>
                    </div>
                    <Progress value={model.cost === "Free" ? 100 : 60} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dataset Distribution */}
      <Card className="bg-white/90 backdrop-blur-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Activity className="w-6 h-6 mr-3 text-emerald-600" />
            Research Dataset Distribution
          </CardTitle>
          <CardDescription className="text-lg">
            Distribution of microgreen varieties in your research dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats?.datasetStats || {}).map(([seedType, count]) => {
              const maxCount = Math.max(...Object.values(stats?.datasetStats || {}))
              const percentage = (count / maxCount) * 100

              return (
                <div
                  key={seedType}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                    <span className="font-medium text-lg capitalize">{seedType.replace(/([A-Z])/g, " $1").trim()}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="w-48 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="text-lg font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-500">samples</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
