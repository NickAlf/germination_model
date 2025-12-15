"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sprout, BarChart3, Camera, Leaf, TrendingUp, Settings, Plus, Thermometer, Droplets, Sun } from "lucide-react"
import Link from "next/link"

type TabType = "dashboard" | "tracker" | "ai-analysis" | "dataset" | "results"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeGrowing: 0,
    photosAnalyzed: 0,
    successRate: 0,
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/dashboard")
        if (response.ok) {
          const data = await response.json()
          setStats({
            totalRecords: data.totalRecords || 0,
            activeGrowing: data.activeGrowing || 0,
            photosAnalyzed: data.totalPhotos || 0,
            successRate: Math.round(data.successRate || 0),
          })
        }
      } catch (error) {
        console.error("[v0] Failed to fetch analytics:", error)
      }
    }
    fetchAnalytics()
  }, [])

  const tabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: BarChart3 },
    { id: "tracker" as TabType, label: "Tracker", icon: Sprout },
    { id: "ai-analysis" as TabType, label: "AI Analysis", icon: Camera },
    { id: "dataset" as TabType, label: "Dataset", icon: Leaf },
    { id: "results" as TabType, label: "Results", icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Microgreens Check</h1>
                <p className="text-sm text-gray-600">Intelligent Seed Germination Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                Pro Plan
              </Badge>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Records</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRecords}</p>
                      <p className="text-sm text-green-600 mt-1">+2 from last week</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Growing</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeGrowing}</p>
                      <p className="text-sm text-gray-500 mt-1">Currently sprouting</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Photos Analyzed</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.photosAnalyzed}</p>
                      <p className="text-sm text-gray-500 mt-1">AI-powered insights</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.successRate}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${stats.successRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <p className="text-sm text-gray-600">Start tracking new microgreens or analyze photos</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/tracker">
                    <Button className="w-full justify-start bg-gray-900 hover:bg-gray-800" size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Germination Record
                    </Button>
                  </Link>
                  <Link href="/analyze">
                    <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                      <Camera className="w-4 h-4 mr-2" />
                      Analyze Photo with AI
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Seed Variety Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Seed Variety Distribution</CardTitle>
                  <p className="text-sm text-gray-600">Your most grown microgreen varieties</p>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No data yet. Start tracking to see your distribution!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Growing Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Growing Conditions</CardTitle>
                <p className="text-sm text-gray-600">Optimal conditions for your active microgreens</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Thermometer className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Temperature</p>
                      <p className="text-2xl font-bold text-gray-900">21°C</p>
                      <p className="text-sm text-green-600">Optimal range</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Humidity</p>
                      <p className="text-2xl font-bold text-gray-900">75%</p>
                      <p className="text-sm text-green-600">Perfect level</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sun className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Light Hours</p>
                      <p className="text-2xl font-bold text-gray-900">12h</p>
                      <p className="text-sm text-green-600">Recommended</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tracker" && (
          <div className="text-center py-12">
            <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Germination Tracker</h3>
            <p className="text-gray-600 mb-6">Track your microgreen growth progress over time</p>
            <Link href="/tracker">
              <Button>Go to Tracker Dashboard</Button>
            </Link>
          </div>
        )}

        {activeTab === "ai-analysis" && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600 mb-6">Upload photos for intelligent germination detection</p>
            <Link href="/analyze">
              <Button>Start AI Analysis</Button>
            </Link>
          </div>
        )}

        {activeTab === "dataset" && (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dataset Explorer</h3>
            <p className="text-gray-600 mb-6">Explore seed varieties and growing data</p>
            <Link href="/architecture">
              <Button>View Architecture</Button>
            </Link>
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results & Performance</CardTitle>
                <p className="text-sm text-gray-600">View your germination analysis history and success metrics</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-green-50">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-green-700">{stats.totalRecords}</div>
                      <div className="text-sm text-green-600 mt-2">Total Experiments</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-blue-700">{stats.photosAnalyzed}</div>
                      <div className="text-sm text-blue-600 mt-2">Photos Analyzed</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-purple-700">{stats.successRate}%</div>
                      <div className="text-sm text-purple-600 mt-2">Success Rate</div>
                    </CardContent>
                  </Card>
                </div>

                {stats.totalRecords === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
                    <p className="text-gray-600 mb-6">Start analyzing photos to see your results here</p>
                    <Link href="/analyze">
                      <Button>Start Analysis</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Recent Analysis</h3>
                      <Link href="/tracker">
                        <Button variant="outline">View All Records</Button>
                      </Link>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your germination tracking history shows {stats.activeGrowing} active experiments with{" "}
                      {stats.photosAnalyzed} analyzed images and an overall success rate of {stats.successRate}%.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
