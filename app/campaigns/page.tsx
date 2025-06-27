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
import { Plus, CalendarIcon, Send, Users, Megaphone, Clock } from "lucide-react"

interface CampaignForm {
  campaignName: string
  messageBody: string
  sendTime: Date | undefined
  tags: string[]
  type: "email" | "sms"
}

export default function CampaignsPage() {
  const { toast } = useToast()
  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    campaignName: "",
    messageBody: "",
    sendTime: undefined,
    tags: [],
    type: "email",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-filled tag options
  const availableTags = [
    "past clients",
    "no-shows",
    "active clients",
    "new leads",
    "follow-up needed",
    "anxiety clients",
    "depression clients",
    "couples therapy",
    "group therapy",
    "cancelled appointments",
  ]

  const handleSubmitCampaign = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!campaignForm.campaignName || !campaignForm.messageBody || !campaignForm.sendTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignName: campaignForm.campaignName,
          messageBody: campaignForm.messageBody,
          sendTime: campaignForm.sendTime.toISOString(),
          tags: campaignForm.tags,
          type: campaignForm.type,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Campaign Created",
          description: `Campaign "${campaignForm.campaignName}" has been scheduled successfully`,
        })

        // Reset form
        setCampaignForm({
          campaignName: "",
          messageBody: "",
          sendTime: undefined,
          tags: [],
          type: "email",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create campaign",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTag = (tag: string) => {
    setCampaignForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const campaignTemplates = {
    welcome:
      "Welcome to our practice! We're excited to support you on your mental health journey. If you have any questions, please don't hesitate to reach out.",
    checkIn:
      "Hi {{name}}, just checking in to see how you're doing. Remember, I'm here if you need support or want to schedule a session.",
    appointment:
      "Hi {{name}}, this is a reminder about your upcoming appointment on {{date}} at {{time}}. Looking forward to seeing you!",
    followUp:
      "Hi {{name}}, thank you for your recent session. How are you feeling about the techniques we discussed? Feel free to reach out if you have questions.",
  }

  const useTemplate = (template: string) => {
    setCampaignForm({
      ...campaignForm,
      messageBody: template,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">Create and schedule email & SMS campaigns for your clients</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Campaign Builder Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Campaign Builder
            </CardTitle>
            <CardDescription>Create targeted campaigns for specific client groups</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitCampaign} className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  value={campaignForm.campaignName}
                  onChange={(e) => setCampaignForm({ ...campaignForm, campaignName: e.target.value })}
                  placeholder="e.g., Monthly Wellness Check-in"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Campaign Type</Label>
                <Select
                  value={campaignForm.type}
                  onValueChange={(value: "email" | "sms") => setCampaignForm({ ...campaignForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Campaign</SelectItem>
                    <SelectItem value="sms">SMS Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="messageBody">Message Body</Label>
                <Textarea
                  id="messageBody"
                  value={campaignForm.messageBody}
                  onChange={(e) => setCampaignForm({ ...campaignForm, messageBody: e.target.value })}
                  placeholder="Use {{name}}, {{date}}, {{time}} for personalization..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label>Send Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignForm.sendTime ? format(campaignForm.sendTime, "PPP") : "Schedule send time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={campaignForm.sendTime}
                      onSelect={(date) => setCampaignForm({ ...campaignForm, sendTime: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Target Tags</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant={campaignForm.tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="justify-start"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Selected: {campaignForm.tags.length} tag(s)</p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Create & Schedule Campaign
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Campaign Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Message Templates</CardTitle>
            <CardDescription>Quick-start templates for common campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(campaignTemplates).map(([key, template]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCampaignForm((prev) => ({ ...prev, messageBody: template }))}
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

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Upcoming campaigns</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
