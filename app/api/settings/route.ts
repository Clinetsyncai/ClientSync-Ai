import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("Settings received:", {
      therapistName: data.therapistName,
      specialties: data.specialties,
      tone: data.tone,
      timestamp: new Date().toISOString(),
    })

    // Here you would typically save to database
    // For now, we'll just log and return success

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      data: data,
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 })
  }
}
