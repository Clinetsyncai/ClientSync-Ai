"use client"

import { Button } from "@/components/ui/button"
import { useButtonColor } from "@/components/color-picker-provider"
import type { ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

interface CustomButtonProps extends ButtonProps {
  useCustomColor?: boolean
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "default", useCustomColor = true, style, ...props }, ref) => {
    const { buttonColor } = useButtonColor()

    const getCustomStyle = () => {
      if (!useCustomColor) return style

      switch (variant) {
        case "default":
          return {
            backgroundColor: buttonColor,
            borderColor: buttonColor,
            color: "white",
            ...style,
          }
        case "outline":
          return {
            borderColor: buttonColor,
            color: buttonColor,
            backgroundColor: "transparent",
            ...style,
          }
        case "secondary":
          return {
            backgroundColor: `${buttonColor}20`,
            color: buttonColor,
            borderColor: `${buttonColor}40`,
            ...style,
          }
        default:
          return style
      }
    }

    return (
      <Button
        className={`hover:opacity-90 transition-opacity ${className}`}
        variant={variant}
        style={getCustomStyle()}
        ref={ref}
        {...props}
      />
    )
  },
)

CustomButton.displayName = "CustomButton"
