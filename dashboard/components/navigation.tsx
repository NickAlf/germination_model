"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sprout, User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavigationProps {
  currentView: "dashboard" | "admin"
  onViewChange: (view: "dashboard" | "admin") => void
  demoMode?: boolean
  onExitDemo?: () => void
}

export function Navigation({ currentView, onViewChange, demoMode, onExitDemo }: NavigationProps) {
  const { user, signOut, isAdmin } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Sprout className="w-8 h-8 text-green-600 mr-2" />
            <span className="text-xl font-bold">MicroGreen Tracker</span>
            {demoMode && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                DEMO MODE
              </Badge>
            )}
          </div>
          <div className="flex space-x-4">
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              onClick={() => onViewChange("dashboard")}
            >
              Dashboard
            </Button>
            {(isAdmin || demoMode) && (
              <Button variant={currentView === "admin" ? "default" : "ghost"} onClick={() => onViewChange("admin")}>
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="text-sm">{demoMode ? "Demo User" : user?.name}</span>
            {(isAdmin || demoMode) && <Badge variant="secondary">Admin</Badge>}
          </div>
          <Button variant="ghost" size="sm" onClick={demoMode ? onExitDemo : signOut}>
            <LogOut className="w-4 h-4" />
            {demoMode ? "Exit Demo" : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  )
}
