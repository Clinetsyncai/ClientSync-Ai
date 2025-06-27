"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, MapPin, Calendar, MessageSquare, Star, Clock, TrendingUp, Activity } from "lucide-react"

interface ClientProfileModalProps {
  isOpen: boolean
  onClose: () => void
  clientName: string
}

interface ClientProfile {
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  status: "Active" | "Inactive" | "Follow-up"
  tags: string[]
  totalSessions: number
  lastSession: string
  nextAppointment?: string
  notes: string
  recentActivity: Array<{
    type: string
    description: string
    date: string
    icon: any
  }>
  progress: {
    engagement: number
    responseRate: number
    satisfaction: number
  }
}

const mockClientData: Record<string, ClientProfile> = {
  "Sarah Johnson": {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    joinDate: "March 15, 2023",
    status: "Active",
    tags: ["Anxiety", "CBT", "High Priority"],
    totalSessions: 24,
    lastSession: "January 12, 2024",
    nextAppointment: "January 19, 2024 at 2:00 PM",
    notes:
      "Making excellent progress with anxiety management techniques. Responds well to CBT approaches. Very engaged in homework assignments.",
    recentActivity: [
      {
        type: "Session",
        description: "Completed CBT session - anxiety management",
        date: "2 days ago",
        icon: Calendar,
      },
      {
        type: "Message",
        description: "Sent check-in message response",
        date: "3 days ago",
        icon: MessageSquare,
      },
      {
        type: "Homework",
        description: "Completed breathing exercises log",
        date: "5 days ago",
        icon: Activity,
      },
    ],
    progress: {
      engagement: 92,
      responseRate: 88,
      satisfaction: 95,
    },
  },
  "Mike Chen": {
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 234-5678",
    location: "Los Angeles, CA",
    joinDate: "January 8, 2024",
    status: "Follow-up",
    tags: ["Depression", "EMDR", "New Client"],
    totalSessions: 6,
    lastSession: "January 10, 2024",
    nextAppointment: "January 17, 2024 at 10:00 AM",
    notes:
      "New client showing good engagement. Missed last appointment, needs follow-up call. Responding well to initial EMDR sessions.",
    recentActivity: [
      {
        type: "Missed",
        description: "Missed scheduled appointment",
        date: "1 day ago",
        icon: Clock,
      },
      {
        type: "Call",
        description: "Auto-reply sent for missed call",
        date: "15 minutes ago",
        icon: Phone,
      },
    ],
    progress: {
      engagement: 76,
      responseRate: 65,
      satisfaction: 82,
    },
  },
  "Emma Davis": {
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "(555) 345-6789",
    location: "Chicago, IL",
    joinDate: "November 22, 2023",
    status: "Active",
    tags: ["Anxiety", "Mindfulness", "Regular"],
    totalSessions: 18,
    lastSession: "January 13, 2024",
    nextAppointment: "January 20, 2024 at 4:00 PM",
    notes:
      "Consistent progress with mindfulness techniques. Left positive review recently. Very reliable with appointments and homework.",
    recentActivity: [
      {
        type: "Review",
        description: "Left 5-star review on Google",
        date: "1 hour ago",
        icon: Star,
      },
      {
        type: "Session",
        description: "Completed mindfulness session",
        date: "1 day ago",
        icon: Calendar,
      },
    ],
    progress: {
      engagement: 94,
      responseRate: 96,
      satisfaction: 98,
    },
  },
}

export function ClientProfileModal({ isOpen, onClose, clientName }: ClientProfileModalProps) {
  const client = mockClientData[clientName]

  if (!client) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      case "Follow-up":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getProgressColor = (value: number) => {
    if (value >= 90) return "#10B981" // Green
    if (value >= 75) return "#3B82F6" // Blue
    if (value >= 60) return "#F59E0B" // Amber
    return "#EF4444" // Red
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`/placeholder-avatar-${client.name.split(" ")[0].toLowerCase()}.jpg`} />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">{client.name}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Client since {client.joinDate} • {client.totalSessions} sessions completed
              </DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(client.status)} variant="outline">
                  {client.status}
                </Badge>
                {client.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.location}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Sessions</span>
                    <span className="font-semibold">{client.totalSessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Session</span>
                    <span className="font-semibold">{client.lastSession}</span>
                  </div>
                  {client.nextAppointment && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Next Appointment</span>
                      <span className="font-semibold text-primary">{client.nextAppointment}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {client.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Complete history of therapy sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Session history would be displayed here</p>
                  <p className="text-sm">Integration with calendar system required</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Engagement</CardTitle>
                  <CardDescription>Session attendance & participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: getProgressColor(client.progress.engagement) }}
                  >
                    {client.progress.engagement}%
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${client.progress.engagement}%`,
                        backgroundColor: getProgressColor(client.progress.engagement),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Response Rate</CardTitle>
                  <CardDescription>Communication responsiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: getProgressColor(client.progress.responseRate) }}
                  >
                    {client.progress.responseRate}%
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${client.progress.responseRate}%`,
                        backgroundColor: getProgressColor(client.progress.responseRate),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Satisfaction</CardTitle>
                  <CardDescription>Overall treatment satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: getProgressColor(client.progress.satisfaction) }}
                  >
                    {client.progress.satisfaction}%
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${client.progress.satisfaction}%`,
                        backgroundColor: getProgressColor(client.progress.satisfaction),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
                <CardDescription>Treatment notes and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed">{client.notes}</p>
                </div>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
