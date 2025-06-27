"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, HelpCircle, Brain, Send, Trash2, Eye } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  type: "multiple_choice" | "scale" | "text"
  options?: string[]
  required: boolean
}

interface QuizForm {
  title: string
  description: string
  questions: QuizQuestion[]
}

interface QuizSubmission {
  answers: Record<string, any>
  personalizedResult?: string
}

export default function QuizFunnelsPage() {
  const { toast } = useToast()
  const [quizForm, setQuizForm] = useState<QuizForm>({
    title: "",
    description: "",
    questions: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    question: "",
    type: "multiple_choice",
    options: [""],
    required: true,
  })

  const [quizSubmission, setQuizSubmission] = useState<QuizSubmission>({
    answers: {},
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const addQuestion = () => {
    if (currentQuestion.question && quizForm.questions.length < 5) {
      const newQuestion: QuizQuestion = {
        id: `q${quizForm.questions.length + 1}`,
        question: currentQuestion.question,
        type: currentQuestion.type || "multiple_choice",
        options:
          currentQuestion.type === "multiple_choice" ? currentQuestion.options?.filter((o) => o.trim()) : undefined,
        required: currentQuestion.required || false,
      }

      setQuizForm({
        ...quizForm,
        questions: [...quizForm.questions, newQuestion],
      })

      // Reset current question
      setCurrentQuestion({
        question: "",
        type: "multiple_choice",
        options: [""],
        required: true,
      })
    }
  }

  const removeQuestion = (questionId: string) => {
    setQuizForm({
      ...quizForm,
      questions: quizForm.questions.filter((q) => q.id !== questionId),
    })
  }

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...(currentQuestion.options || []), ""],
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])]
    newOptions[index] = value
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    })
  }

  const handleQuizSubmit = async () => {
    if (!quizForm.title || quizForm.questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add a title and at least one question",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizTitle: quizForm.title,
          quizDescription: quizForm.description,
          questions: quizForm.questions,
          answers: quizSubmission.answers,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setQuizSubmission({
          ...quizSubmission,
          personalizedResult: result.personalizedResult,
        })

        toast({
          title: "Quiz Created",
          description: "Your AI-powered quiz has been created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create quiz",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setQuizSubmission({
      ...quizSubmission,
      answers: {
        ...quizSubmission.answers,
        [questionId]: answer,
      },
    })
  }

  const generatePreviewResult = async () => {
    if (Object.keys(quizSubmission.answers).length === 0) {
      toast({
        title: "Error",
        description: "Please answer at least one question to see the preview",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizTitle: quizForm.title,
          answers: quizSubmission.answers,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setQuizSubmission({
          ...quizSubmission,
          personalizedResult: result.personalizedResult,
        })
      }
    } catch (error) {
      console.error("Error generating result:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quiz Funnels</h2>
          <p className="text-muted-foreground">Create AI-powered lead magnets with personalized results</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Quiz Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quiz Builder
            </CardTitle>
            <CardDescription>Create 3-5 questions for your lead magnet quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="e.g., Anxiety Assessment Quiz"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                placeholder="Brief description of what this quiz helps with..."
                rows={2}
              />
            </div>

            {/* Current Questions */}
            {quizForm.questions.length > 0 && (
              <div className="space-y-2">
                <Label>Questions ({quizForm.questions.length}/5)</Label>
                {quizForm.questions.map((question, index) => (
                  <div key={question.id} className="border rounded p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">
                          {index + 1}. {question.question}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {question.type.replace("_", " ")}
                          </Badge>
                          {question.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        {question.options && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            Options: {question.options.join(", ")}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Question */}
            {quizForm.questions.length < 5 && (
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Question {quizForm.questions.length + 1}</h4>

                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    placeholder="Enter your question..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Question Type</Label>
                    <Select
                      value={currentQuestion.type}
                      onValueChange={(value: QuizQuestion["type"]) =>
                        setCurrentQuestion({ ...currentQuestion, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="scale">Scale (1-10)</SelectItem>
                        <SelectItem value="text">Text Input</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {currentQuestion.type === "multiple_choice" && (
                  <div>
                    <Label>Answer Options</Label>
                    <div className="space-y-2 mt-2">
                      {currentQuestion.options?.map((option, index) => (
                        <Input
                          key={index}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addOption}>
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}

                <Button onClick={addQuestion} disabled={!currentQuestion.question}>
                  Add Question
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleQuizSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Creating Quiz...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Create Quiz
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                disabled={quizForm.questions.length === 0}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Quiz Preview
            </CardTitle>
            <CardDescription>Test your quiz and see AI-generated results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizForm.title && (
              <div>
                <h3 className="text-lg font-semibold">{quizForm.title}</h3>
                {quizForm.description && <p className="text-sm text-muted-foreground mt-1">{quizForm.description}</p>}
              </div>
            )}

            {quizForm.questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-sm font-medium">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-500">*</span>}
                </Label>

                {question.type === "multiple_choice" && question.options && (
                  <Select onValueChange={(value) => handleAnswerChange(question.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, optIndex) => (
                        <SelectItem key={optIndex} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.type === "scale" && (
                  <Select onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate from 1-10" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.type === "text" && (
                  <Textarea
                    placeholder="Enter your answer..."
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    rows={2}
                  />
                )}
              </div>
            ))}

            {quizForm.questions.length > 0 && (
              <Button onClick={generatePreviewResult} disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Generating Result...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate AI Result
                  </>
                )}
              </Button>
            )}

            {quizSubmission.personalizedResult && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Your Personalized Result
                </h4>
                <p className="text-sm">{quizSubmission.personalizedResult}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quiz Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">From quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70%</div>
            <p className="text-xs text-muted-foreground">Lead to client</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
