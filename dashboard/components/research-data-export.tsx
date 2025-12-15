"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Database, BarChart3, BookOpen, User } from "lucide-react"

interface ExportOptions {
  format: "csv" | "json" | "excel" | "pdf"
  dateRange: string
  includeImages: boolean
  includeMetrics: boolean
  includeAnalysis: boolean
  includeCharts: boolean
  researchNotes: string
  authorName: string
  institutionName: string
}

const EXPORT_FORMATS = [
  { value: "csv", label: "CSV (Comma Separated)", icon: FileText },
  { value: "json", label: "JSON (JavaScript Object)", icon: Database },
  { value: "excel", label: "Excel Spreadsheet", icon: BarChart3 },
  { value: "pdf", label: "PDF Research Report", icon: BookOpen },
]

const DATE_RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom range" },
]

export function ResearchDataExport() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    dateRange: "30d",
    includeImages: false,
    includeMetrics: true,
    includeAnalysis: true,
    includeCharts: false,
    researchNotes: "",
    authorName: "",
    institutionName: "",
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const response = await fetch("/api/export-research-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportOptions),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `microgreen-research-${timestamp}.${exportOptions.format}`
      a.download = filename

      clearInterval(progressInterval)
      setExportProgress(100)

      setTimeout(() => {
        a.click()
        window.URL.revokeObjectURL(url)
        setIsExporting(false)
        setExportProgress(0)
      }, 500)
    } catch (error) {
      console.error("Export failed:", error)
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-blue-600" />
              <span>Export Configuration</span>
            </CardTitle>
            <CardDescription>Configure your research data export settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Export Format</Label>
              <Select value={exportOptions.format} onValueChange={(value: any) => updateOption("format", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_FORMATS.map((format) => {
                    const Icon = format.icon
                    return (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{format.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Date Range</Label>
              <Select value={exportOptions.dateRange} onValueChange={(value) => updateOption("dateRange", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGES.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Include in Export</Label>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetrics"
                    checked={exportOptions.includeMetrics}
                    onCheckedChange={(checked) => updateOption("includeMetrics", checked)}
                  />
                  <Label htmlFor="includeMetrics" className="text-sm">
                    Performance Metrics & Statistics
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeAnalysis"
                    checked={exportOptions.includeAnalysis}
                    onCheckedChange={(checked) => updateOption("includeAnalysis", checked)}
                  />
                  <Label htmlFor="includeAnalysis" className="text-sm">
                    Germination Analysis Results
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={exportOptions.includeCharts}
                    onCheckedChange={(checked) => updateOption("includeCharts", checked)}
                  />
                  <Label htmlFor="includeCharts" className="text-sm">
                    Charts & Visualizations (PDF only)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeImages"
                    checked={exportOptions.includeImages}
                    onCheckedChange={(checked) => updateOption("includeImages", checked)}
                  />
                  <Label htmlFor="includeImages" className="text-sm">
                    Original Images (Large file size)
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>Research Information</span>
            </CardTitle>
            <CardDescription>Add metadata for academic documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="authorName" className="text-sm font-medium mb-2 block">
                Author Name
              </Label>
              <Input
                id="authorName"
                placeholder="Enter your name"
                value={exportOptions.authorName}
                onChange={(e) => updateOption("authorName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="institutionName" className="text-sm font-medium mb-2 block">
                Institution
              </Label>
              <Input
                id="institutionName"
                placeholder="University or research institution"
                value={exportOptions.institutionName}
                onChange={(e) => updateOption("institutionName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="researchNotes" className="text-sm font-medium mb-2 block">
                Research Notes
              </Label>
              <Textarea
                id="researchNotes"
                placeholder="Add any additional notes about your research methodology, objectives, or findings..."
                value={exportOptions.researchNotes}
                onChange={(e) => updateOption("researchNotes", e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleExport} disabled={isExporting} className="w-full" size="lg">
              {isExporting ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-bounce" />
                  Exporting... {exportProgress}%
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Research Data
                </>
              )}
            </Button>

            {isExporting && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Export Preview</span>
          </CardTitle>
          <CardDescription>Preview of what will be included in your research export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">1,247</div>
                <div className="text-sm text-blue-700">Total Samples</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">15</div>
                <div className="text-sm text-green-700">Microgreen Types</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">94.2%</div>
                <div className="text-sm text-purple-700">Avg. Accuracy</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-900">87.5%</div>
                <div className="text-sm text-orange-700">Germination Rate</div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Export Contents:</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={exportOptions.includeMetrics ? "default" : "secondary"}>
                    {exportOptions.includeMetrics ? "✓" : "○"}
                  </Badge>
                  <span className="text-sm">Performance Metrics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={exportOptions.includeAnalysis ? "default" : "secondary"}>
                    {exportOptions.includeAnalysis ? "✓" : "○"}
                  </Badge>
                  <span className="text-sm">Analysis Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={exportOptions.includeCharts ? "default" : "secondary"}>
                    {exportOptions.includeCharts ? "✓" : "○"}
                  </Badge>
                  <span className="text-sm">Charts & Graphs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={exportOptions.includeImages ? "default" : "secondary"}>
                    {exportOptions.includeImages ? "✓" : "○"}
                  </Badge>
                  <span className="text-sm">Original Images</span>
                </div>
              </div>
            </div>

            {exportOptions.format === "pdf" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">PDF Research Report</span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Your PDF will include a complete research report with methodology, results, statistical analysis, and
                  academic citations ready for thesis submission.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Academic Citation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-indigo-600" />
            <span>Academic Citation</span>
          </CardTitle>
          <CardDescription>Suggested citation format for your research</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <p>
              {exportOptions.authorName || "[Author Name]"}. ({new Date().getFullYear()}). Microgreen Germination
              Detection Using AI-Powered Image Analysis.
              {exportOptions.institutionName || "[Institution Name]"}. Retrieved {new Date().toLocaleDateString()} from
              Microgreen Research Platform.
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            APA format. Adjust according to your institution's citation requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
