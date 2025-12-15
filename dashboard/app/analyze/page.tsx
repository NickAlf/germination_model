"use client"

import TrayGerminationDetector from "@/components/tray-germination-detector"
import { Sprout, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Microgreens Check</h1>
                <p className="text-sm text-gray-600">Intelligent Seed Germination Analysis</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                Pro Plan
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrayGerminationDetector />
      </div>
    </div>
  )
}
