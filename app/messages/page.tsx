"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, User, Sparkles, Settings } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "ai" | "client"
  content: string
  timestamp: string
  clientName?: string
}

interface Conversation {
  id: string
  clientName: string
  lastMessage: string
  timestamp: string
  unread: number
  status: "active" | "resolved" | "pending"
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    lastMessage: "Thank you for the session today, I feel much better.",
    timestamp: "2 min ago",
    unread: 1,
    status: "active",
  },
  {
    id: "2",
    clientName: "Mike Chen",
    lastMessage: "Can we reschedule tomorrow's appointment?",
    timestamp: "15 min ago",
    unread: 2,
    status: "pending",
  },
  {
    id: "3",
    clientName: "Emma Davis",
    lastMessage: "The breathing exercises are really helping!",
    timestamp: "1 hour ago",
    unread: 0,
    status: "resolved",
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "client",
    content:
      "Hi Dr. Smith, I wanted to follow up on our session yesterday. I've been practicing the breathing techniques you taught me.",
    timestamp: "10:30 AM",
    clientName: "Sarah Johnson",
  },
  {
    id: "2",
    sender: "ai",
    content:
      "That's wonderful to hear, Sarah! Consistent practice with breathing techniques is key to managing anxiety. How are you feeling when you use them during stressful moments?",
    timestamp: "10:32 AM",
  },
  {
    id: "3",
    sender: "client",
    content: "Much calmer actually. I used them during a work presentation and it really helped.",
    timestamp: "10:35 AM",
    clientName: "Sarah Johnson",
  },
  {
    id: "4",
    sender: "user",
    content: "That's excellent progress, Sarah. Keep practicing and we'll discuss more techniques in our next session.",
    timestamp: "10:40 AM",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [aiTone, setAiTone] = useState("professional")
  const [isAiEnabled, setIsAiEnabled] = useState(true)

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = newMessage
    setNewMessage("")

    // Show loading state
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      content: "Typing...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, loadingMessage])

    if (isAiEnabled) {
      try {
        const response = await fetch("/api/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageToSend,
            tone: aiTone,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get AI response")
        }

        const data = await response.json()

        // Replace loading message with actual response
        setMessages((prev) => prev.map((msg) => (msg.id === loadingMessage.id ? { ...msg, content: data.reply } : msg)))
      } catch (error) {
        console.error("Error sending message:", error)
        // Replace loading message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, content: "Sorry, I'm having trouble responding right now. Please try again." }
              : msg,
          ),
        )
      }
    } else {
      // Remove loading message if AI is disabled
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
            <p className="text-muted-foreground">AI-powered messaging assistant for client communication</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isAiEnabled ? "default" : "secondary"} className="text-xs">
                <Bot className="mr-1 h-3 w-3" />
                AI {isAiEnabled ? "On" : "Off"}
              </Badge>
              <Select value={aiTone} onValueChange={setAiTone}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="empathetic">Empathetic</SelectItem>
                  <SelectItem value="supportive">Supportive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    selectedConversation === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{conversation.clientName}</h4>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        <Badge className={getStatusColor(conversation.status)} variant="secondary">
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                <CardDescription>Active conversation</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isAiEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAiEnabled(!isAiEnabled)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Assistant
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender === "ai" ? (
                            <Bot className="h-4 w-4" />
                          ) : message.sender === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            message.clientName?.charAt(0) || "C"
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.sender === "ai"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex items-end gap-2 mt-4">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} size="sm" className="h-[60px]">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {isAiEnabled && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                AI suggestions enabled - {aiTone} tone
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
