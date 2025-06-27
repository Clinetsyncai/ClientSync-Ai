"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface MiniChartProps {
  data: Array<{ value: number }>
  color?: string
  trend?: "up" | "down" | "neutral"
}

export function MiniChart({ data, color = "#3B82F6", trend = "neutral" }: MiniChartProps) {
  const strokeColor = trend === "up" ? "#10B981" : trend === "down" ? "#EF4444" : color

  return (
    <div className="h-8 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} dot={false} activeDot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
