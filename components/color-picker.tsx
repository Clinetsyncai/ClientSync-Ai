"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useButtonColor } from "@/components/color-picker-provider"
import { Palette, RotateCcw } from "lucide-react"

const presetColors = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
  "#6366F1", // Indigo
]

export function ColorPicker() {
  const { buttonColor, setButtonColor } = useButtonColor()
  const [tempColor, setTempColor] = useState(buttonColor)

  const handleColorChange = (color: string) => {
    setTempColor(color)
    setButtonColor(color)
  }

  const resetToDefault = () => {
    const defaultColor = "#3B82F6"
    setTempColor(defaultColor)
    setButtonColor(defaultColor)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="button-color">Custom Button Color</Label>
        <p className="text-sm text-muted-foreground mb-3">Choose a color for action buttons throughout the dashboard</p>
      </div>

      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-transparent">
              <div className="w-4 h-4 rounded border mr-2" style={{ backgroundColor: buttonColor }} />
              {buttonColor.toUpperCase()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div>
                <Label htmlFor="color-input">Custom Color</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    id="color-input"
                    type="color"
                    value={tempColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={tempColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Preset Colors</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                        buttonColor === color ? "border-foreground" : "border-muted"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="icon" onClick={resetToDefault} title="Reset to default">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="h-4 w-4" />
          <span className="text-sm font-medium">Preview</span>
        </div>
        <div className="space-y-2">
          <Button
            style={{
              backgroundColor: buttonColor,
              borderColor: buttonColor,
              color: "white",
            }}
            className="hover:opacity-90"
          >
            Sample Action Button
          </Button>
          <Button
            variant="outline"
            style={{
              borderColor: buttonColor,
              color: buttonColor,
            }}
            className="hover:bg-opacity-10 bg-transparent"
          >
            Sample Outline Button
          </Button>
        </div>
      </div>
    </div>
  )
}
