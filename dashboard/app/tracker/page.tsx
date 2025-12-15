"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Dashboard } from "@/components/dashboard"
import { AdminPanel } from "@/components/admin-panel"
import { AuthProvider } from "@/contexts/auth-context"

export default function TrackerPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "admin">("dashboard")

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <div className="container mx-auto p-6">{currentView === "dashboard" ? <Dashboard /> : <AdminPanel />}</div>
      </div>
    </AuthProvider>
  )
}
