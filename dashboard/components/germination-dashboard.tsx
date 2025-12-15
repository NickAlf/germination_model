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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Target, Calendar, Microscope } from "lucide-react"

interface DashboardData {
  overview: {
    totalSamples: number
    averageGermination: number
    topPerformer: string
    recentTrend: "up" | "down"
  }
  germinationRates: Array<{
    type: string
    rate: number
    samples: number
    color: string
  }>
  timeSeriesData: Array<{
    date: string
    germination: number
    samples: number
  }>
  performanceMetrics: Array<{
    metric: string
    value: number
    target: number
    status: "good" | "warning" | "poor"
  }>
}

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4", "#84CC16", "#F97316"]

export function GerminationDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData: DashboardData = {
        overview: {
          totalSamples: 1247,
          averageGermination: 87.5,
          topPerformer: "Cress",
          recentTrend: "up",
        },
        germinationRates: [
          { type: "Cress", rate: 92.3, samples: 156, color: COLORS[0] },
          { type: "Mustard", rate: 91.1, samples: 143, color: COLORS[1] },
          { type: "Radish", rate: 89.7, samples: 189, color: COLORS[2] },
          { type: "Arugula", rate: 88.9, samples: 167, color: COLORS[3] },
          { type: "Broccoli", rate: 87.2, samples: 201, color: COLORS[4] },
          { type: "Kale", rate: 85.6, samples: 134, color: COLORS[5] },
          { type: "Pea Shoots", rate: 84.3, samples: 98, color: COLORS[6] },
          { type: "Sunflower", rate: 82.1, samples: 159, color: COLORS[7] },
        ],
        timeSeriesData: generateTimeSeriesData(selectedPeriod),
        performanceMetrics: [
          { metric: "Detection Accuracy", value: 94.2, target: 90, status: "good" },
          { metric: "Processing Speed", value: 1.8, target: 2.0, status: "good" },
          { metric: "Model Confidence", value: 89.7, target: 85, status: "good" },
          { metric: "False Positives", value: 3.2, target: 5.0, status: "good" },
        ],
      }

      setData(mockData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateTimeSeriesData = (period: string) => {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
    const data = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toISOString().split("T")[0],
        germination: 85 + Math.random() * 10,
        samples: Math.floor(Math.random() * 50) + 20,
      })
    }

    return data
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Total Samples</p>
                <p className="text-2xl font-bold text-green-900">{data.overview.totalSamples.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Avg. Germination</p>
                <p className="text-2xl font-bold text-blue-900">{data.overview.averageGermination}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Top Performer</p>
                <p className="text-2xl font-bold text-purple-900">{data.overview.topPerformer}</p>
              </div>
              <Microscope className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Trend</p>
                <div className="flex items-center space-x-2">
                  {data.overview.recentTrend === "up" ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                  <span className="text-2xl font-bold text-orange-900">
                    {data.overview.recentTrend === "up" ? "+2.3%" : "-1.2%"}
                  </span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="germination" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="germination">Germination Rates</TabsTrigger>
          <TabsTrigger value="trends">Time Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="germination" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Germination Rates by Microgreen Type</CardTitle>
              <CardDescription>
                Comparative analysis of germination success across different microgreen varieties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.germinationRates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sample Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.germinationRates.map((item, index) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{item.samples} samples</div>
                        <div className="text-xs text-gray-500">{item.rate}% rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performanceMetrics.map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <Badge
                          variant={
                            metric.status === "good"
                              ? "default"
                              : metric.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {metric.value}
                          {metric.metric.includes("Speed") ? "s" : "%"}
                        </Badge>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      <div className="text-xs text-gray-500">
                        Target: {metric.target}
                        {metric.metric.includes("Speed") ? "s" : "%"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Germination Trends Over Time</CardTitle>
              <CardDescription>
                Track germination performance and sample volume over selected time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <TabsList>
                    <TabsTrigger value="7d">7 Days</TabsTrigger>
                    <TabsTrigger value="30d">30 Days</TabsTrigger>
                    <TabsTrigger value="90d">90 Days</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="germination" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Analysis</CardTitle>
              <CardDescription>Detailed analysis of AI model accuracy and processing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="germination"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Germination Rate"
                  />
                  <Line type="monotone" dataKey="samples" stroke="#3B82F6" strokeWidth={2} name="Daily Samples" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Distribution</CardTitle>
              <CardDescription>Visual breakdown of sample distribution across microgreen types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data.germinationRates}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, samples }) => `${type}: ${samples}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="samples"
                  >
                    {data.germinationRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
