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
import { AISuggestionsPanel } from "@/components/ai-suggestions-panel"
import { AnimatedProgressBar } from "@/components/animated-progress-bar"
import { Users, MessageSquare, Calendar, TrendingUp, Phone, Mail, Star, Clock, Filter } from "lucide-react"
import { CustomButton } from "@/components/custom-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [activityFilter, setActivityFilter] = useState("all")

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Mock data for mini charts
  const generateChartData = (trend: "up" | "down" | "neutral") => {
    const baseValue = 50
    return Array.from({ length: 7 }, (_, i) => ({
      value:
        trend === "up"
          ? baseValue + i * 5 + Math.random() * 10
          : trend === "down"
            ? baseValue - i * 3 + Math.random() * 8
            : baseValue + (Math.random() - 0.5) * 20,
    }))
  }

  const stats = [
    {
      title: "Total Clients",
      value: "127",
      change: "+12%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      positive: true,
      chartData: generateChartData("up"),
      trend: "up" as const,
      tooltip: "Total number of active clients in your practice",
    },
    {
      title: "Messages Today",
      value: "23",
      change: "+5%",
      icon: MessageSquare,
      color: "text-green-600 dark:text-soft-green",
      bgColor: "bg-green-100 dark:bg-soft-green/10",
      positive: true,
      chartData: generateChartData("up"),
      trend: "up" as const,
      tooltip: "Messages sent and received today through the platform",
    },
    {
      title: "Appointments",
      value: "8",
      change: "Today",
      icon: Calendar,
      color: "text-purple-600 dark:text-soft-purple",
      bgColor: "bg-purple-100 dark:bg-soft-purple/10",
      positive: true,
      chartData: generateChartData("neutral"),
      trend: "neutral" as const,
      tooltip: "Scheduled appointments for today",
    },
    {
      title: "Response Rate",
      value: "94%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-green-600 dark:text-soft-green",
      bgColor: "bg-green-100 dark:bg-soft-green/10",
      positive: true,
      chartData: generateChartData("up"),
      trend: "up" as const,
      tooltip: "Percentage of clients who respond to your messages",
    },
  ]

  const recentActivity = [
    {
      type: "message",
      client: "Sarah Johnson",
      action: "Sent automated check-in",
      time: "2 minutes ago",
      icon: MessageSquare,
      color: "text-primary",
      category: "message",
    },
    {
      type: "call",
      client: "Mike Chen",
      action: "Missed call - auto-reply sent",
      time: "15 minutes ago",
      icon: Phone,
      color: "text-purple-600 dark:text-soft-purple",
      category: "call",
    },
    {
      type: "review",
      client: "Emma Davis",
      action: "Left 5-star review",
      time: "1 hour ago",
      icon: Star,
      color: "text-green-600 dark:text-soft-green",
      category: "review",
    },
    {
      type: "reminder",
      client: "John Smith",
      action: "Appointment reminder sent",
      time: "2 hours ago",
      icon: Clock,
      color: "text-primary",
      category: "reminder",
    },
  ]

  const filteredActivity = recentActivity.filter((activity) => {
    if (activityFilter === "all") return true
    return activity.category === activityFilter
  })

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background min-h-screen transition-colors relative">
      {/* Background watermark */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-primary">
          ClientSync AI
        </div>
      </div>

      <div className="flex items-center justify-between space-y-2 relative z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <div className="relative h-8 overflow-hidden">
              <h2
                className={`text-3xl font-bold tracking-tight text-foreground absolute transition-opacity duration-800 ${
                  showWelcome ? "opacity-100" : "opacity-0"
                }`}
              >
                Welcome back 👋
              </h2>
              <h2
                className={`text-3xl font-bold tracking-tight text-foreground absolute transition-opacity duration-800 ${
                  showWelcome ? "opacity-0" : "opacity-100"
                }`}
              >
                Dashboard
              </h2>
            </div>
            <p className="text-muted-foreground mt-1">Here's what's happening in your practice today.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
          <ThemeToggle />
          <UserProfileDropdown />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <HelpTooltip content={stat.tooltip} />
              </div>
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={
                        stat.positive ? "text-green-600 dark:text-soft-green" : "text-red-600 dark:text-soft-red"
                      }
                    >
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </div>
                <MiniChart data={stat.chartData} trend={stat.trend} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12 relative z-10">
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    Recent Activity
                    <HelpTooltip content="Latest interactions and automated actions from your practice" />
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Latest interactions and automated actions
                  </CardDescription>
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
              <div className="space-y-4">
                {filteredActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">{activity.client}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                Quick Actions
                <HelpTooltip content="Common tasks and shortcuts for managing your practice" />
              </CardTitle>
              <CardDescription className="text-muted-foreground">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <CustomButton className="justify-start hover:scale-[1.02] transition-transform" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Bulk Message
              </CustomButton>
              <CustomButton className="justify-start hover:scale-[1.02] transition-transform" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Create Campaign
              </CustomButton>
              <CustomButton className="justify-start hover:scale-[1.02] transition-transform" variant="outline">
                <Star className="mr-2 h-4 w-4" />
                Request Reviews
              </CustomButton>
              <CustomButton className="justify-start hover:scale-[1.02] transition-transform" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Reminders
              </CustomButton>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <AISuggestionsPanel />

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                AI Assistant Status
                <HelpTooltip content="Current status of your AI automation features" />
              </CardTitle>
              <CardDescription className="text-muted-foreground">Current AI automation settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Auto-replies</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-soft-green/20 dark:text-soft-green dark:border-soft-green/30">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Missed call responses</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-soft-green/20 dark:text-soft-green dark:border-soft-green/30">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Review requests</span>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-soft-purple/20 dark:text-soft-purple dark:border-soft-purple/30">
                    Scheduled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                This Week's Goals
                <HelpTooltip content="Track your weekly practice objectives and progress" />
              </CardTitle>
              <CardDescription className="text-muted-foreground">Track your practice objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Client check-ins</span>
                    <span className="text-foreground">23/30</span>
                  </div>
                  <AnimatedProgressBar value={23} max={30} color="#3B82F6" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Review requests</span>
                    <span className="text-foreground">8/15</span>
                  </div>
                  <AnimatedProgressBar value={8} max={15} color="#10B981" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">New leads</span>
                    <span className="text-foreground">5/10</span>
                  </div>
                  <AnimatedProgressBar value={5} max={10} color="#A78BFA" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security badge */}
      <div className="fixed bottom-4 left-4 z-40">
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          🔒 HIPAA-Ready | End-to-End Encrypted
        </Badge>
      </div>

      <FloatingHelpButton />
    </div>
  )
}
