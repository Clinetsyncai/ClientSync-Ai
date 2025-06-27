"use client"

import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HelpTooltipProps {
  content: string
  side?: "top" | "right" | "bottom" | "left"
}

export function HelpTooltip({ content, side = "top" }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200" />
        </TooltipTrigger>
        <TooltipContent side={side} className="tooltip-content max-w-xs z-50">
          <p className="text-sm font-medium">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
