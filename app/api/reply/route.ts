import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const OPENAI_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  const { message, tone = "professional" } = await request.json()

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  // 1. If an API key is available, call OpenAI normally.
  if (OPENAI_KEY) {
    try {
      const systemPrompts = {
        professional:
          "You are a professional therapist assistant. Provide helpful, evidence-based responses while maintaining professional boundaries. Always encourage clients to seek in-person therapy when appropriate.",
        empathetic:
          "You are a warm, empathetic therapist assistant. Show understanding and compassion in your responses while providing helpful guidance. Always encourage professional therapy when needed.",
        supportive:
          "You are a supportive therapist assistant. Provide encouraging, positive responses that help clients feel heard and supported. Always recommend professional therapy for serious concerns.",
      }

      const { text } = await generateText({
        model: openai("gpt-4o", { apiKey: OPENAI_KEY }),
        system: systemPrompts[tone as keyof typeof systemPrompts] ?? systemPrompts.professional,
        prompt: message,
        maxTokens: 500,
      })

      return NextResponse.json({
        reply: text,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error("OpenAI error:", err)
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
    }
  }

  // 2. Fallback for preview / missing key – avoids crashing.
  console.warn("OPENAI_API_KEY missing – returning stubbed response")
  return NextResponse.json(
    {
      reply:
        "AI is not configured in this preview. Please add your OPENAI_API_KEY in the environment to enable live responses.",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  )
}
