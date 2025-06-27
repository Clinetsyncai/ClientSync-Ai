"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Brain, ChevronDown, ChevronRight, Clock, UserX, MessageSquare, Calendar } from "lucide-react"

interface Suggestion {
  id: string
  type: "action" | "follow-up" | "inactive"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  count?: number
  action?: string
}

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    type: "follow-up",
    title: "Follow up with non-responders",
    description: "3 clients haven't responded in 7+ days",
    priority: "high",
    count: 3,
    action: "Send follow-up",
  },
  {
    id: "2",
    type: "inactive",
    title: "Re-engage inactive clients",
    description: "5 clients inactive for 14+ days",
    priority: "medium",
    count: 5,
    action: "Send check-in",
  },
  {
    id: "3",
    type: "action",
    title: "Schedule review requests",
    description: "8 completed sessions without review requests",
    priority: "medium",
    count: 8,
    action: "Request reviews",
  },
  {
    id: "4",
    type: "action",
    title: "Update client notes",
    description: "2 sessions missing progress notes",
    priority: "low",
    count: 2,
    action: "Add notes",
  },
]

export function AISuggestionsPanel() {
  const [isOpen, setIsOpen] = useState(true)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "follow-up":
        return <MessageSquare className="h-4 w-4" />
      case "inactive":
        return <UserX className="h-4 w-4" />
      case "action":
        return <Calendar className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-80">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI Suggestions</CardTitle>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <CardDescription>Recommended actions for today</CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {mockSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{getTypeIcon(suggestion.type)}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                    {suggestion.priority}
                  </Badge>
                </div>
                {suggestion.action && (
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    {suggestion.action}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
