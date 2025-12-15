"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Brain, TrendingUp, Target } from "lucide-react"

export function AnalysisResults({ data }: { data: any }) {
  /* ────────────────────────────── NO DATA ────────────────────────────── */
  if (!data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center gap-4">
          <BarChart3 className="w-12 h-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No analysis data yet</h3>
          <p className="text-gray-600 max-w-md">
            Click&nbsp;
            <span className="font-semibold">Run Analysis</span> on the dashboard to generate insights from your
            microgreen dataset.
          </p>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Run Analysis
          </Button>
        </CardContent>
      </Card>
    )
  }

  /* ─────────────────────────── WITH DATA ─────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Germination patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Germination Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(data.germination_patterns || {}).map(([seedType, stats]: [string, any]) => (
              <div key={seedType} className="p-4 border rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-medium capitalize">{seedType.replace("_", " ")}</h4>
                <div className="flex justify-between text-sm">
                  <span>Avg&nbsp;Days</span>
                  <Badge variant="outline">{stats.avg_days}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success&nbsp;Rate</span>
                  <Badge
                    className={
                      stats.success_rate > 0.8 ? "bg-green-500 hover:bg-green-500" : "bg-yellow-500 hover:bg-yellow-500"
                    }
                  >
                    {(stats.success_rate * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <StatBlock
              label="Optimal Temp"
              value={`${data.environmental_factors?.optimal_temp ?? 22.5}°C`}
              color="text-blue-600"
            />
            <StatBlock
              label="Optimal Humidity"
              value={`${data.environmental_factors?.optimal_humidity ?? 75}%`}
              color="text-green-600"
            />
            <StatBlock
              label="Light Correlation"
              value={((data.environmental_factors?.light_correlation ?? 0.67) * 100).toFixed(0)}
              suffix="%"
              color="text-purple-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Placeholder ML model section (can be wired to real API later) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            ML Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Accuracy", value: "94%", color: "text-green-600" },
              { label: "Precision", value: "0.92", color: "text-blue-600" },
              { label: "Recall", value: "0.89", color: "text-purple-600" },
              { label: "F1-Score", value: "0.91", color: "text-orange-600" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            *These metrics are demo values. Connect your trained model via the API to see real performance.*
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ──────────────────────────── Helpers ─────────────────────────── */
function StatBlock({
  label,
  value,
  suffix = "",
  color,
}: {
  label: string
  value: string | number
  suffix?: string
  color: string
}) {
  return (
    <div className="p-6 bg-muted/50 rounded-lg">
      <div className={`text-3xl font-bold mb-1 ${color}`}>
        {value}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
