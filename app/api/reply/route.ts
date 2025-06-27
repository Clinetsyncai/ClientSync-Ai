import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, tone = "professional" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // System prompt based on tone
    const systemPrompts = {
      professional:
        "You are a professional therapist assistant. Provide helpful, evidence-based responses while maintaining professional boundaries. Always encourage clients to seek in-person therapy when appropriate.",
      empathetic:
        "You are a warm, empathetic therapist assistant. Show understanding and compassion in your responses while providing helpful guidance. Always encourage professional therapy when needed.",
      supportive:
        "You are a supportive therapist assistant. Provide encouraging, positive responses that help clients feel heard and supported. Always recommend professional therapy for serious concerns.",
    }

    const systemPrompt = systemPrompts[tone as keyof typeof systemPrompts] || systemPrompts.professional

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
    })

    return NextResponse.json({
      reply: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating AI response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
