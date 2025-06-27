"use client"

import { useEffect, useState } from "react"

interface AnimatedProgressBarProps {
  value: number
  max: number
  color?: string
  className?: string
}

export function AnimatedProgressBar({ value, max, color = "#3B82F6", className = "" }: AnimatedProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className={`h-2 rounded-full bg-muted overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${animatedValue}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        }}
      />
    </div>
  )
}
