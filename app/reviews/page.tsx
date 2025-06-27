"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Send, Mail, MessageSquare, Calendar, TrendingUp, ThumbsUp } from "lucide-react"

interface Session {
  id: string
  clientName: string
  date: string
  type: string
  status: "completed" | "upcoming" | "cancelled"
  reviewRequested: boolean
  reviewReceived: boolean
  rating?: number
  reviewText?: string
}

interface ReviewRequest {
  clientName: string
  sessionDate: string
  method: "email" | "sms"
  message: string
}

const mockSessions: Session[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    date: "2024-01-15",
    type: "Individual Therapy",
    status: "completed",
    reviewRequested: false,
    reviewReceived: false,
  },
  {
    id: "2",
    clientName: "Mike Chen",
    date: "2024-01-14",
    type: "Couples Therapy",
    status: "completed",
    reviewRequested: true,
    reviewReceived: false,
  },
  {
    id: "3",
    clientName: "Emma Davis",
    date: "2024-01-13",
    type: "Individual Therapy",
    status: "completed",
    reviewRequested: true,
    reviewReceived: true,
    rating: 5,
    reviewText: "Dr. Smith has been incredibly helpful. The sessions have given me tools to manage my anxiety better.",
  },
  {
    id: "4",
    clientName: "John Smith",
    date: "2024-01-12",
    type: "Group Therapy",
    status: "completed",
    reviewRequested: true,
    reviewReceived: true,
    rating: 4,
    reviewText: "Great experience overall. Very professional and understanding.",
  },
  {
    id: "5",
    clientName: "Lisa Wong",
    date: "2024-01-16",
    type: "Individual Therapy",
    status: "upcoming",
    reviewRequested: false,
    reviewReceived: false,
  },
]

const mockReviews = [
  {
    id: "1",
    clientName: "Emma Davis",
    rating: 5,
    text: "Dr. Smith has been incredibly helpful. The sessions have given me tools to manage my anxiety better.",
    date: "2024-01-14",
    platform: "Google",
  },
  {
    id: "2",
    clientName: "John Smith",
    rating: 4,
    text: "Great experience overall. Very professional and understanding.",
    date: "2024-01-13",
    platform: "Psychology Today",
  },
  {
    id: "3",
    clientName: "Maria Garcia",
    rating: 5,
    text: "Excellent therapist! I've made significant progress in just a few sessions.",
    date: "2024-01-10",
    platform: "Google",
  },
]

export default function ReviewsPage() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  const completedSessions = sessions.filter((s) => s.status === "completed")
  const reviewsReceived = sessions.filter((s) => s.reviewReceived).length
  const reviewsRequested = sessions.filter((s) => s.reviewRequested).length
  const averageRating =
    sessions.filter((s) => s.rating).reduce((sum, s) => sum + (s.rating || 0), 0) /
      sessions.filter((s) => s.rating).length || 0

  const handleRequestReview = (session: Session) => {
    setSelectedSession(session)
    setIsRequestDialogOpen(true)
  }

  const handleSendReviewRequest = (request: ReviewRequest) => {
    if (selectedSession) {
      setSessions(sessions.map((s) => (s.id === selectedSession.id ? { ...s, reviewRequested: true } : s)))
    }
    setIsRequestDialogOpen(false)
    setSelectedSession(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            <p className="text-muted-foreground">Request and manage client reviews for your practice</p>
          </div>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewsReceived}</div>
            <p className="text-xs text-muted-foreground">{reviewsRequested} requested</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">{renderStars(Math.round(averageRating))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviewsRequested > 0 ? Math.round((reviewsReceived / reviewsRequested) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {reviewsReceived} of {reviewsRequested} responded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">New reviews received</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Sessions eligible for review requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.slice(0, 5).map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.clientName}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {session.reviewReceived ? (
                        <div className="flex items-center gap-1">{renderStars(session.rating || 0)}</div>
                      ) : session.reviewRequested ? (
                        <Badge variant="outline">Requested</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {session.status === "completed" && !session.reviewRequested && (
                        <Button size="sm" onClick={() => handleRequestReview(session)}>
                          <Send className="mr-2 h-4 w-4" />
                          Request
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Latest reviews from your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.clientName}</span>
                        <div className="flex items-center">{renderStars(review.rating)}</div>
                        <Badge variant="outline" className="text-xs">
                          {review.platform}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">"{review.text}"</p>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Review</DialogTitle>
            <DialogDescription>Send a review request to {selectedSession?.clientName}</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <ReviewRequestForm
              session={selectedSession}
              onSend={handleSendReviewRequest}
              onCancel={() => setIsRequestDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ReviewRequestForm({
  session,
  onSend,
  onCancel,
}: {
  session: Session
  onSend: (request: ReviewRequest) => void
  onCancel: () => void
}) {
  const [method, setMethod] = useState<"email" | "sms">("email")
  const [message, setMessage] = useState(
    method === "email"
      ? `Hi ${session.clientName},\n\nI hope you found our recent session helpful. If you have a moment, I'd greatly appreciate if you could share your experience by leaving a review.\n\nYour feedback helps me continue to provide the best care possible.\n\nThank you for your time!\n\nBest regards,\nDr. Smith`
      : `Hi ${session.clientName}, I hope our recent session was helpful! If you have a moment, could you please leave a review about your experience? Your feedback means a lot. Thank you!`,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend({
      clientName: session.clientName,
      sessionDate: session.date,
      method,
      message,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Send Method</Label>
        <div className="flex gap-4 mt-2">
          <Button
            type="button"
            variant={method === "email" ? "default" : "outline"}
            onClick={() => setMethod("email")}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button
            type="button"
            variant={method === "sms" ? "default" : "outline"}
            onClick={() => setMethod("sms")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            SMS
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={method === "email" ? 8 : 4}
          className="mt-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Send className="mr-2 h-4 w-4" />
          Send Request
        </Button>
      </div>
    </form>
  )
}
