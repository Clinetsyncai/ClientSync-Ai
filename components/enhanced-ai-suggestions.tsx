"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Lightbulb, Zap } from "lucide-react"

type Suggestion = {
  id: number
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  impact: "Quick Win" | "High Impact" | "Consider"
  action: string
  revenue?: number
}

const suggestionsData: Suggestion[] = [
  {
    id: 1,
    title: "3 clients need immediate follow-up",
    description: "Mike Chen, Lisa Wong, and David Kim haven’t responded in 7+ days.",
    priority: "High",
    impact: "Quick Win",
    action: "Send personalized follow-up",
    revenue: 1200,
  },
  {
    id: 2,
    title: "8 clients ready for review requests",
    description: "Recent sessions completed with high satisfaction scores.",
    priority: "Medium",
    impact: "High Impact",
    action: "Send review requests",
  },
  {
    id: 3,
    title: "5 inactive clients (14+ days)",
    description: "Long-term clients who may need re-engagement.",
    priority: "Medium",
    impact: "Quick Win",
    action: "Send wellness check-in",
    revenue: 2500,
  },
]

export function EnhancedAiSuggestions({ showRevenue }: { showRevenue: boolean }) {
  const [openSuggestion, setOpenSuggestion] = useState<number | null>(1)

  if (!suggestionsData.length) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI-Powered Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No new insights for you today. Check back later!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        Actionable Insights
      </h2>
      <div className="space-y-3">
        {suggestionsData.map((suggestion) => (
          <Collapsible
            key={suggestion.id}
            open={openSuggestion === suggestion.id}
            onOpenChange={() => setOpenSuggestion(openSuggestion === suggestion.id ? null : suggestion.id)}
            className="premium-card"
          >
            <CollapsibleTrigger className="w-full p-4">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className="font-semibold">{suggestion.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`priority-badge priority-${suggestion.priority.toLowerCase()}`}>
                      {suggestion.priority}
                    </Badge>
                    <Badge className={`impact-badge impact-${suggestion.impact.toLowerCase().replace(" ", "-")}`}>
                      {suggestion.impact}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {showRevenue && suggestion.revenue && (
                    <span className="text-green-600 font-semibold dark:text-green-400">
                      +${suggestion.revenue.toLocaleString()}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${openSuggestion === suggestion.id ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0">
              <div className="border-t pt-4">
                <p className="text-muted-foreground mb-4">{suggestion.description}</p>
                <Button>{suggestion.action}</Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
