"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Database, Download, Filter, Search } from "lucide-react"

const MOCK_PREVIEW = [
  {
    id: 1,
    seed_type: "Broccoli",
    temperature_c: 22.5,
    humidity_percent: 75,
    days_to_germinate: 5,
    germination_rate: 0.89,
    quality_score: 0.85,
  },
  {
    id: 2,
    seed_type: "Radish",
    temperature_c: 21.0,
    humidity_percent: 80,
    days_to_germinate: 3,
    germination_rate: 0.94,
    quality_score: 0.91,
  },
  {
    id: 3,
    seed_type: "Pea Shoots",
    temperature_c: 24.0,
    humidity_percent: 70,
    days_to_germinate: 8,
    germination_rate: 0.82,
    quality_score: 0.78,
  },
  {
    id: 4,
    seed_type: "Sunflower",
    temperature_c: 23.0,
    humidity_percent: 65,
    days_to_germinate: 6,
    germination_rate: 0.76,
    quality_score: 0.73,
  },
  {
    id: 5,
    seed_type: "Arugula",
    temperature_c: 20.5,
    humidity_percent: 78,
    days_to_germinate: 4,
    germination_rate: 0.91,
    quality_score: 0.88,
  },
]

const SEED_TYPES = ["Broccoli", "Radish", "Pea Shoots", "Sunflower", "Arugula", "Kale"]

export function DatasetExplorer() {
  const [seedType, setSeedType] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = MOCK_PREVIEW.filter((row) => {
    const matchesType = seedType === "all" || row.seed_type === seedType
    const matchesSearch = search === "" || row.seed_type.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Germination Dataset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-sm text-gray-600">Seed Varieties</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-gray-600">Avg Success Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">5.2</div>
              <div className="text-sm text-gray-600">Avg Days to Germinate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Data Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search seed type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Seed Type</label>
            <Select value={seedType} onValueChange={setSeedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {SEED_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dataset Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Seed Type</th>
                  <th className="p-3 text-left font-medium">Temperature (°C)</th>
                  <th className="p-3 text-left font-medium">Humidity (%)</th>
                  <th className="p-3 text-left font-medium">Days to Germinate</th>
                  <th className="p-3 text-left font-medium">Success Rate</th>
                  <th className="p-3 text-left font-medium">Quality Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{row.id}</td>
                    <td className="p-3">
                      <Badge variant="outline">{row.seed_type}</Badge>
                    </td>
                    <td className="p-3">{row.temperature_c}</td>
                    <td className="p-3">{row.humidity_percent}</td>
                    <td className="p-3">{row.days_to_germinate}</td>
                    <td className="p-3">
                      <span
                        className={`font-medium ${row.germination_rate > 0.8 ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {(row.germination_rate * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-3">{row.quality_score.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filtered.length} of {MOCK_PREVIEW.length} records
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
