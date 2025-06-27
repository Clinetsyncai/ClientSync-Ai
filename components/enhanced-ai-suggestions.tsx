"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Clock,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  DollarSign,
  Settings,
} from "lucide-react"

interface Suggestion {
  id: string
  type: "urgent" | "follow-up" | "opportunity" | "maintenance"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  impact: "high" | "medium" | "low"
  effort: "low" | "medium" | "high"
  count?: number
  action?: string
  deadline?: string
  estimatedTime?: string
  potentialRevenue?: string
  clients?: string[]
}

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    type: "urgent",
    title: "3 clients need immediate follow-up",
    description: "Mike Chen, Lisa Wong, and David Kim haven't responded in 7+ days",
    priority: "high",
    impact: "high",
    effort: "low",
    count: 3,
    action: "Send personalized follow-up",
    deadline: "Today",
    estimatedTime: "15 min",
    clients: ["Mike Chen", "Lisa Wong", "David Kim"],
  },
  {
    id: "2",
    type: "opportunity",
    title: "8 clients ready for review requests",
    description: "Recent sessions completed with high satisfaction scores",
    priority: "medium",
    impact: "medium",
    effort: "low",
    count: 8,
    action: "Send review requests",
    deadline: "This week",
    estimatedTime: "10 min",
    potentialRevenue: "Improved online presence",
    clients: [
      "Sarah Johnson",
      "Emma Davis",
      "John Smith",
      "Maria Garcia",
      "Alex Thompson",
      "Rachel Lee",
      "Tom Wilson",
      "Nina Patel",
    ],
  },
  {
    id: "3",
    type: "follow-up",
    title: "5 inactive clients (14+ days)",
    description: "Long-term clients who may need re-engagement",
    priority: "medium",
    impact: "high",
    effort: "medium",
    count: 5,
    action: "Send wellness check-in",
    deadline: "Next week",
    estimatedTime: "25 min",
    potentialRevenue: "$2,500 potential",
    clients: ["Jennifer Brown", "Mark Davis", "Sophie Chen", "Robert Taylor", "Amanda White"],
  },
  {
    id: "4",
    type: "opportunity",
    title: "Schedule group therapy session",
    description: "6 anxiety clients could benefit from group setting",
    priority: "low",
    impact: "high",
    effort: "high",
    count: 6,
    action: "Plan group session",
    deadline: "Next month",
    estimatedTime: "2 hours",
    potentialRevenue: "$1,800 potential",
    clients: ["Sarah Johnson", "Emma Davis", "Lisa Wong", "Nina Patel", "Sophie Chen", "Rachel Lee"],
  },
]

export function EnhancedAISuggestions() {
  const [isOpen, setIsOpen] = useState(true)
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([])
  const [showRevenue, setShowRevenue] = useState(true)
  const [aiInsights, setAiInsights] = useState({
    weeklyGoalProgress: 73,
    clientEngagement: 89,
    revenueOpportunity: 4300,
    timeToComplete: 95,
  })

  useEffect(() => {
    // Simulate daily auto-updates
    const interval = setInterval(() => {
      setAiInsights((prev) => ({
        ...prev,
        weeklyGoalProgress: Math.min(100, prev.weeklyGoalProgress + Math.random() * 2),
        clientEngagement: Math.max(75, Math.min(100, prev.clientEngagement + (Math.random() - 0.5) * 3)),
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "badge-muted-coral"
      case "medium":
        return "badge-soft-yellow"
      case "low":
        return "badge-sage-green"
      default:
        return "badge-muted"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "follow-up":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getImpactBadge = (impact: string, effort: string) => {
    const score =
      (impact === "high" ? 3 : impact === "medium" ? 2 : 1) - (effort === "high" ? 1 : effort === "medium" ? 0.5 : 0)

    if (score >= 2.5) return { label: "Quick Win", className: "badge-sage-green" }
    if (score >= 1.5) return { label: "High Impact", className: "badge-soft-blue" }
    if (score >= 0.5) return { label: "Consider", className: "badge-soft-yellow" }
    return { label: "Low Priority", className: "badge-muted" }
  }

  const handleCompleteSuggestion = (suggestionId: string) => {
    setCompletedSuggestions((prev) => [...prev, suggestionId])
  }

  const activeSuggestions = mockSuggestions.filter((s) => !completedSuggestions.includes(s.id))
  const urgentCount = activeSuggestions.filter((s) => s.priority === "high").length

  return (
    <Card className="w-80 premium-card collapsible-card" data-state={isOpen ? "open" : "closed"}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors duration-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">🧠 AI Insights</CardTitle>
                {urgentCount > 0 && (
                  <Badge className="badge-muted-coral h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {urgentCount}
                  </Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )}
            </div>
            <CardDescription className="text-muted-foreground">
              Daily recommendations • {activeSuggestions.length} active
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent className="transition-all duration-300 ease-in-out">
          <CardContent className="space-y-4 pt-0">
            {/* AI Insights Summary */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-primary metric-value">{aiInsights.weeklyGoalProgress}%</div>
                <div className="text-xs text-muted-foreground">Weekly Goals</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-500 metric-value">{aiInsights.clientEngagement}%</div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
            </div>

            {/* Revenue Opportunity Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Show Revenue</span>
              </div>
              <Switch checked={showRevenue} onCheckedChange={setShowRevenue} />
            </div>

            {/* Revenue Opportunity */}
            {showRevenue && aiInsights.revenueOpportunity > 0 && (
              <div
                className="revenue-toggle p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                data-enabled={showRevenue}
              >
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">Revenue Opportunity</span>
                </div>
                <div className="text-lg font-bold text-green-700 dark:text-green-400 metric-value">
                  ${aiInsights.revenueOpportunity.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">Potential from active suggestions</div>
              </div>
            )}

            {/* Active Suggestions */}
            <div className="space-y-3">
              {activeSuggestions.slice(0, 4).map((suggestion) => {
                const impactBadge = getImpactBadge(suggestion.impact, suggestion.effort)

                return (
                  <div
                    key={suggestion.id}
                    className="border rounded-lg p-3 space-y-3 bg-card hover:bg-muted/20 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-muted-foreground">{getTypeIcon(suggestion.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-foreground truncate">{suggestion.title}</h4>
                            {suggestion.count && <Badge className="badge-muted text-xs">{suggestion.count}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>

                          {/* Metadata */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {suggestion.estimatedTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {suggestion.estimatedTime}
                              </span>
                            )}
                            {suggestion.deadline && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {suggestion.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={`${getPriorityBadge(suggestion.priority)} text-xs font-medium`}>
                          {suggestion.priority}
                        </Badge>
                        <Badge className={`${impactBadge.className} text-xs font-medium`}>{impactBadge.label}</Badge>
                      </div>
                    </div>

                    {showRevenue && suggestion.potentialRevenue && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        💰 {suggestion.potentialRevenue}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {suggestion.action && (
                        <Button
                          size="sm"
                          className="flex-1 soft-button bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 dark:border-blue-800"
                          onClick={() => handleCompleteSuggestion(suggestion.id)}
                        >
                          {suggestion.action}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCompleteSuggestion(suggestion.id)}
                        className="px-2 hover:bg-muted/50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Completion Progress */}
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Today's Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedSuggestions.length}/{mockSuggestions.length}
                </span>
              </div>
              <Progress value={(completedSuggestions.length / mockSuggestions.length) * 100} className="h-2" />
            </div>

            {activeSuggestions.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs">Great work on your practice management</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
