"use client"

import type { GerminationRecord } from "@/lib/types"

interface GerminationChartProps {
  records: GerminationRecord[]
}

export function GerminationChart({ records }: GerminationChartProps) {
  const getStageProgress = (stage: string) => {
    switch (stage) {
      case "planted":
        return 25
      case "sprouting":
        return 50
      case "germinated":
        return 75
      case "mature":
        return 100
      default:
        return 0
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "planted":
        return "#6B7280"
      case "sprouting":
        return "#F59E0B"
      case "germinated":
        return "#10B981"
      case "mature":
        return "#3B82F6"
      default:
        return "#6B7280"
    }
  }

  const getDaysPlanted = (plantingDate: string) => {
    const planted = new Date(plantingDate)
    const now = new Date()
    return Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-4">
      {records.map((record) => {
        const daysPlanted = getDaysPlanted(record.planting_date)
        const progress = getStageProgress(record.current_stage)
        const isOnTrack = daysPlanted <= record.expected_germination_days

        return (
          <div key={record.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{record.seed_type}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Day {daysPlanted}/{record.expected_germination_days}
                </span>
                <span className={`text-sm ${isOnTrack ? "text-green-600" : "text-red-600"}`}>
                  {isOnTrack ? "On Track" : "Overdue"}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: getStageColor(record.current_stage),
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Planted</span>
              <span>Sprouting</span>
              <span>Germinated</span>
              <span>Mature</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
