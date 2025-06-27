"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { HelpTooltip } from "@/components/help-tooltip"
import { FloatingHelpButton } from "@/components/floating-help-button"
import { MiniChart } from "@/components/mini-chart"
import { AnimatedProgressBar } from "@/components/animated-progress-bar"
import { CustomButton } from "@/components/custom-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportReportsButton } from "@/components/export-reports-button"
import { EnhancedAISuggestions } from "@/components/enhanced-ai-suggestions"
import { ClientProfileModal } from "@/components/client-profile-modal"

import { MessageSquare, Calendar, Phone, Mail, Star, Clock, Filter } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  /* ---------- STATE ---------- */
  const [showWelcome, setShowWelcome] = useState(true)
  const [activityFilter, setActivityFilter] = useState("all")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [weeklyGoals, setWeeklyGoals] = useState({
    checkIns: { current: 23, target: 30 },
    reviews: { current: 8, target: 15 },
    leads: { current: 5, target: 10 },
  })

  /* ---------- EFFECTS ---------- */
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  /* ---------- MOCK DATA ---------- */
  const generateChartData = (trend: "up" | "down" | "neutral") =>
    Array.from({ length: 7 }, (_, i) => ({
      value:
        trend === "up"
          ? 50 + i * 6 + Math.random() * 5
          : trend === "down"
            ? 60 - i * 4 + Math.random() * 4
            : 50 + (Math.random() - 0.5) * 10,
    }))

  const stats = [
    {
      title: "Total Clients",
      value: "127",
      change: "+12%",
      icon: "👥",
      color: "text-primary",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      positive: true,
      chartData: generateChartData("up"),
      trend: "up" as const,
      tooltip: "Total number of active clients in your practice",
      link: "/crm",
    },
    {
      title: "Messages Today",
      value: "23",
      change: "+5%",
      icon: "💬",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      positive: true,
      chartData: generateChartData("up"),
      trend: "up" as const,
      tooltip: "Messages sent and received today",
      link: "/messages",
    },
    {
      title: "Appointments",
      value: "8",
      change: "Today",
      icon: "📅",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      positive: true,
      chartData: generateChartData("neutral"),
      trend: "neutral" as const,
      tooltip: "Scheduled appointments for today",
      link: "/calendar",
    },
    {
      title: "Response Rate",
      value: "94%",
      change: "+2%",
      icon: "📈",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      positive: true,
      chartData: generateChartData("up"),
      trend: "up" as const,
      tooltip: "Percentage of clients who respond to your messages",
      link: "/analytics",
    },
  ]

  const recentActivity = [
    {
      type: "message",
      client: "Sarah Johnson",
      action: "Sent automated check-in",
      time: "2 min ago",
      icon: MessageSquare,
      color: "text-primary",
      category: "message",
    },
    {
      type: "call",
      client: "Mike Chen",
      action: "Missed call – auto-reply sent",
      time: "15 min ago",
      icon: Phone,
      color: "text-purple-600 dark:text-purple-400",
      category: "call",
    },
    {
      type: "review",
      client: "Emma Davis",
      action: "Left 5-star review",
      time: "1 h ago",
      icon: Star,
      color: "text-green-600 dark:text-green-400",
      category: "review",
    },
    {
      type: "reminder",
      client: "John Smith",
      action: "Appointment reminder sent",
      time: "2 h ago",
      icon: Clock,
      color: "text-primary",
      category: "reminder",
    },
  ]

  const filteredActivity = recentActivity.filter((a) =>
    activityFilter === "all" ? true : a.category === activityFilter,
  )

  /* ---------- HANDLERS ---------- */
  const openClientProfile = (clientName: string) => {
    setSelectedClient(clientName)
    setIsClientModalOpen(true)
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="flex-1 space-y-4 p-3 md:p-6 pt-4 md:pt-6 bg-background min-h-screen relative">
      {/* Background watermark */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-9xl font-black text-primary">
          ClientSync AI
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div>
            <div className="relative h-10 overflow-hidden">
              <h1 className={`text-3xl font-bold absolute welcome-fade-in ${showWelcome ? "" : "welcome-fade-out"}`}>
                Welcome back 👋
              </h1>
              <h1
                className={`text-3xl font-bold absolute dashboard-fade-in ${showWelcome ? "dashboard-fade-out" : ""}`}
              >
                Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground text-sm font-normal -mt-1">
              Here's what's happening in your practice today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExportReportsButton />
          <NotificationsDropdown />
          <ThemeToggle />
          <UserProfileDropdown />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.title} href={s.link}>
            <Card className="stats-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
                  <HelpTooltip content={s.tooltip} />
                </div>
                <div className={`h-8 w-8 rounded-lg ${s.bgColor} flex items-center justify-center text-lg`}>
                  {s.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold metric-value">{s.value}</div>
                    <p className="text-xs text-muted-foreground font-normal">
                      <span
                        className={s.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
                      >
                        {s.change}
                      </span>{" "}
                      from last month
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <MiniChart data={s.chartData} trend={s.trend} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-12 relative z-10">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-4">
          {/* Recent Activity */}
          <Card className="premium-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Recent Activity
                    <HelpTooltip content="Latest interactions and automated actions" />
                  </CardTitle>
                  <CardDescription>Latest interactions and automated actions</CardDescription>
                </div>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activity</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                    <SelectItem value="call">Calls</SelectItem>
                    <SelectItem value="review">Reviews</SelectItem>
                    <SelectItem value="reminder">Reminders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredActivity.map((a, i) => (
                  <div key={i} className="activity-item flex items-center space-x-3 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
                      <a.icon className={`h-4 w-4 ${a.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => openClientProfile(a.client)}
                        className="text-sm font-medium text-left focus-ring hover:underline"
                      >
                        {a.client}
                      </button>
                      <p className="text-sm text-muted-foreground truncate font-normal">{a.action}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Quick Actions
                <HelpTooltip content="Common tasks and shortcuts" />
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/messages">
                <CustomButton variant="outline" className="justify-start w-full soft-button">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Bulk Message
                </CustomButton>
              </Link>
              <Link href="/campaigns">
                <CustomButton variant="outline" className="justify-start w-full soft-button">
                  <Mail className="mr-2 h-4 w-4" />
                  Create Campaign
                </CustomButton>
              </Link>
              <Link href="/reviews">
                <CustomButton variant="outline" className="justify-start w-full soft-button">
                  <Star className="mr-2 h-4 w-4" />
                  Request Reviews
                </CustomButton>
              </Link>
              <Link href="/reminders">
                <CustomButton variant="outline" className="justify-start w-full soft-button">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Reminders
                </CustomButton>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-4">
          <EnhancedAISuggestions />

          {/* AI Assistant Status */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 AI Assistant Status
                <HelpTooltip content="Current status of AI automation" />
              </CardTitle>
              <CardDescription>Current automation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Auto-replies", active: true },
                { label: "Missed-call responses", active: true },
                { label: "Review requests", active: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-normal">{item.label}</span>
                  <Badge className={item.active ? "badge-sage-green" : "badge-soft-yellow"}>
                    {item.active ? "Active" : "Paused"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 This Week&#39;s Goals
                <HelpTooltip content="Track your weekly objectives" />
              </CardTitle>
              <CardDescription>Track your practice objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(weeklyGoals).map(([key, goal]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1 capitalize">
                    <span className="text-muted-foreground font-normal">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-semibold metric-value">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <AnimatedProgressBar
                    value={goal.current}
                    max={goal.target}
                    color="#60a5fa"
                    className="animated-progress"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile AI suggestions panel */}
      <div className="lg:hidden">
        <EnhancedAISuggestions />
      </div>

      {/* HIPAA badge */}
      <div className="fixed bottom-4 left-4 z-40">
        <Badge className="hipaa-badge soft-button">🔒 HIPAA-Ready | End-to-End Encrypted</Badge>
      </div>

      {/* Floating help */}
      <FloatingHelpButton />

      {/* Client profile modal */}
      {selectedClient && (
        <ClientProfileModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          clientName={selectedClient}
        />
      )}
    </div>
  )
}
