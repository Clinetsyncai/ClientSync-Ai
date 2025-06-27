"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ColorPickerProviderProps = {
  children: React.ReactNode
  defaultColor?: string
  storageKey?: string
}

type ColorPickerProviderState = {
  buttonColor: string
  setButtonColor: (color: string) => void
}

const initialState: ColorPickerProviderState = {
  buttonColor: "#3B82F6", // Default calming blue
  setButtonColor: () => null,
}

const ColorPickerProviderContext = createContext<ColorPickerProviderState>(initialState)

export function ColorPickerProvider({
  children,
  defaultColor = "#3B82F6",
  storageKey = "clientsync-button-color",
  ...props
}: ColorPickerProviderProps) {
  const [buttonColor, setButtonColor] = useState<string>(defaultColor)

  useEffect(() => {
    // Load saved color from localStorage on mount
    const savedColor = localStorage.getItem(storageKey)
    if (savedColor) {
      setButtonColor(savedColor)
    }
  }, [storageKey])

  useEffect(() => {
    // Update CSS custom property when color changes
    document.documentElement.style.setProperty("--custom-button-color", buttonColor)
  }, [buttonColor])

  const value = {
    buttonColor,
    setButtonColor: (color: string) => {
      localStorage.setItem(storageKey, color)
      setButtonColor(color)
    },
  }

  return (
    <ColorPickerProviderContext.Provider {...props} value={value}>
      {children}
    </ColorPickerProviderContext.Provider>
  )
}

export const useButtonColor = () => {
  const context = useContext(ColorPickerProviderContext)

  if (context === undefined) throw new Error("useButtonColor must be used within a ColorPickerProvider")

  return context
}
