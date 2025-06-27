import { type NextRequest, NextResponse } from "next/server"

// Mock Google Sheets data - replace with actual Sheet.best endpoint
const MOCK_CLIENTS_DATA = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    email: "sarah.j@email.com",
    city: "New York",
    tags: "Anxiety,CBT",
    status: "Active",
    notes: "Making great progress with anxiety management techniques.",
    lastContact: "2024-01-15",
  },
  {
    id: "2",
    name: "Mike Chen",
    phone: "(555) 234-5678",
    email: "mike.chen@email.com",
    city: "Los Angeles",
    tags: "Depression,EMDR",
    status: "Follow-up",
    notes: "Missed last appointment, needs follow-up call.",
    lastContact: "2024-01-10",
  },
]

export async function GET() {
  try {
    // In production, replace this with actual Sheet.best API call:
    // const response = await fetch('https://api.sheetbest.com/sheets/YOUR_SHEET_ID')
    // const data = await response.json()

    return NextResponse.json({
      success: true,
      data: MOCK_CLIENTS_DATA,
    })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData = await request.json()

    console.log("New client created:", {
      ...clientData,
      timestamp: new Date().toISOString(),
    })

    // In production, you would:
    // 1. Add to Google Sheets via Sheet.best POST
    // 2. Or save to your database

    return NextResponse.json({
      success: true,
      message: "Client created successfully",
      clientId: `client_${Date.now()}`,
      data: clientData,
    })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ success: false, error: "Failed to create client" }, { status: 500 })
  }
}
