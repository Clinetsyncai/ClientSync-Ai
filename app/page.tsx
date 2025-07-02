"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { EnhancedAiSuggestions } from "@/components/enhanced-ai-suggestions"
import { Bell, Calendar, DollarSign, FileText, MessageSquare, Plus, Users } from "lucide-react"

// Mock data - replace with your actual data fetching
const dashboardData = {
  stats: [
    { title: "Active Clients", value: "84", icon: Users, change: "+12.5%" },
    { title: "Appointments", value: "112", icon: Calendar, change: "+5.2%" },
    { title: "Response Rate", value: "94%", icon: MessageSquare, change: "-1.8%" },
  ],
  revenue: {
    potential: 4300,
    from: "active suggestions",
  },
  weeklyGoals: [
    { title: "New Client Onboarding", progress: 80 },
    { title: "Follow-up Messages Sent", progress: 65 },
  ],
  recentActivity: [
    { type: "New Client", description: "Alex Johnson was added.", icon: Users, time: "2m ago" },
    { type: "Appointment", description: "Meeting with Samantha Lee.", icon: Calendar, time: "1h ago" },
    { type: "Message", description: "Follow-up sent to David Chen.", icon: MessageSquare, time: "3h ago" },
  ],
  quickActions: [
    { title: "New Client", icon: Plus },
    { title: "Send Message", icon: MessageSquare },
    { title: "Create Invoice", icon: FileText },
    { title: "Book Appointment", icon: Calendar },
  ],
}

export default function DashboardPage() {
  const [showRevenue, setShowRevenue] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, here’s your practice at a glance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="sleek-button bg-transparent">
              <Bell className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Stats Cards */}
          {dashboardData.stats.map((stat) => (
            <Card key={stat.title} className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}

          {/* Revenue Opportunity Card */}
          <div
            className={`md:col-span-2 transition-all duration-500 ease-in-out ${showRevenue ? "opacity-100" : "opacity-0 h-0 overflow-hidden p-0 border-0"}`}
          >
            {showRevenue && (
              <Card className="premium-card bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/30 dark:to-cyan-900/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Revenue Opportunity
                    </CardTitle>
                    <Switch id="revenue-toggle" checked={showRevenue} onCheckedChange={setShowRevenue} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    ${dashboardData.revenue.potential.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">Potential from {dashboardData.revenue.from}</p>
                </CardContent>
              </Card>
            )}
          </div>
          {!showRevenue && (
            <div className="md:col-span-2 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Label htmlFor="revenue-toggle">Show Revenue</Label>
                <Switch id="revenue-toggle" checked={showRevenue} onCheckedChange={setShowRevenue} />
              </div>
            </div>
          )}

          {/* Weekly Goals Card */}
          <Card className="premium-card md:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.weeklyGoals.map((goal) => (
                <div key={goal.title}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{goal.title}</p>
                    <p className="text-sm text-muted-foreground">{goal.progress}%</p>
                  </div>
                  <Progress value={goal.progress} className="h-2 minimal-progress-bar" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedAiSuggestions showRevenue={showRevenue} />
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {dashboardData.quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="sleek-button justify-start gap-2 bg-transparent"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          <activity.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
