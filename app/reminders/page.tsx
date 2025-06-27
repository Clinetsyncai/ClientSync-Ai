"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Plus, CalendarIcon, Send, Clock, Mail, MessageSquare } from "lucide-react"

interface ReminderForm {
  date: Date | undefined
  message: string
  type: "SMS" | "email"
  recipients: string
  title: string
}

export default function RemindersPage() {
  const { toast } = useToast()
  const [reminderForm, setReminderForm] = useState<ReminderForm>({
    date: undefined,
    message: "",
    type: "SMS",
    recipients: "",
    title: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const messageTemplates = {
    appointment:
      "Hi {{name}}, this is a reminder about your appointment tomorrow at {{time}}. Please reply CONFIRM to confirm.",
    followUp:
      "Hi {{name}}, how are you feeling after our last session? Remember to practice the techniques we discussed.",
    checkIn: "Hi {{name}}, just checking in to see how you're doing this week. I'm here if you need support.",
    medication:
      "Hi {{name}}, don't forget to take your medication as prescribed. Consistency is important for your treatment.",
  }

  const handleSubmitReminder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reminderForm.date || !reminderForm.message || !reminderForm.recipients) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: reminderForm.date.toISOString(),
          message: reminderForm.message,
          type: reminderForm.type,
          recipients: reminderForm.recipients.split(",").map((r) => r.trim()),
          title: reminderForm.title,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Reminder Scheduled",
          description: "Your automated reminder has been set up successfully",
        })

        // Reset form
        setReminderForm({
          date: undefined,
          message: "",
          type: "SMS",
          recipients: "",
          title: "",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to schedule reminder",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error scheduling reminder:", error)
      toast({
        title: "Error",
        description: "Failed to schedule reminder",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const useTemplate = (template: string) => {
    setReminderForm({
      ...reminderForm,
      message: template,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Smart Reminders</h2>
          <p className="text-muted-foreground">Set up automated SMS and email reminders for your clients</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Reminder Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Automated Reminder
            </CardTitle>
            <CardDescription>Schedule reminders to be sent automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReminder} className="space-y-4">
              <div>
                <Label htmlFor="title">Reminder Title</Label>
                <Input
                  id="title"
                  value={reminderForm.title}
                  onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                  placeholder="e.g., Appointment Reminder"
                />
              </div>

              <div>
                <Label>Send Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {reminderForm.date ? format(reminderForm.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={reminderForm.date}
                      onSelect={(date) => setReminderForm({ ...reminderForm, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="type">Reminder Type</Label>
                <Select
                  value={reminderForm.type}
                  onValueChange={(value: "SMS" | "email") => setReminderForm({ ...reminderForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMS">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  value={reminderForm.recipients}
                  onChange={(e) => setReminderForm({ ...reminderForm, recipients: e.target.value })}
                  placeholder="Client names or tags (comma-separated)"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={reminderForm.message}
                  onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
                  placeholder="Use {{name}}, {{time}}, {{date}} for personalization..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Schedule Reminder
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Message Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Templates</CardTitle>
            <CardDescription>Pre-built message templates you can customize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(messageTemplates).map(([key, template]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReminderForm({ ...reminderForm, message: template })}
                  >
                    Use Template
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{template}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Reminders sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Client confirmations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Total reminders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
