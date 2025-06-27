import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("Quiz submission received:", {
      quizTitle: data.quizTitle,
      answers: data.answers,
      timestamp: new Date().toISOString(),
    })

    // Generate personalized result using GPT-4
    const answersText = Object.entries(data.answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join("\n")

    const { text: personalizedResult } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are a professional therapist providing personalized insights based on quiz responses. Provide helpful, encouraging feedback while maintaining professional boundaries. Always recommend seeking professional help when appropriate.",
      prompt: `Based on these quiz responses, provide a personalized, supportive result (2-3 paragraphs):\n\n${answersText}`,
      maxTokens: 400,
    })

    const result = {
      success: true,
      personalizedResult,
      quizId: `quiz_${Date.now()}`,
      submissionId: `sub_${Date.now()}`,
      data: data,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing quiz:", error)
    return NextResponse.json({ success: false, error: "Failed to process quiz" }, { status: 500 })
  }
}
