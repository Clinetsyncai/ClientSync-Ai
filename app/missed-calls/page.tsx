"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Phone, PhoneCall, MessageSquare, Settings, Play, Pause } from "lucide-react"

interface MissedCall {
  id: string
  clientName: string
  phoneNumber: string
  timestamp: string
  autoTextSent: boolean
  status: "pending" | "responded" | "ignored"
}

export default function MissedCallsPage() {
  const { toast } = useToast()
  const [missedCalls, setMissedCalls] = useState<MissedCall[]>([
    {
      id: "1",
      clientName: "Sarah Johnson",
      phoneNumber: "(555) 123-4567",
      timestamp: "2024-01-15 14:30",
      autoTextSent: true,
      status: "responded",
    },
    {
      id: "2",
      clientName: "Mike Chen",
      phoneNumber: "(555) 234-5678",
      timestamp: "2024-01-15 11:15",
      autoTextSent: false,
      status: "pending",
    },
  ])

  const [autoTextEnabled, setAutoTextEnabled] = useState(true)
  const [autoTextMessage, setAutoTextMessage] = useState(
    "Hi! I missed your call. I'll get back to you as soon as possible. If this is urgent, please text me or call our emergency line at (555) 999-0000.",
  )
  const [isSimulating, setIsSimulating] = useState(false)

  // Simulate incoming calls
  const simulateIncomingCall = () => {
    const mockCallers = [
      { name: "Emma Davis", phone: "(555) 345-6789" },
      { name: "John Smith", phone: "(555) 456-7890" },
      { name: "Lisa Wong", phone: "(555) 567-8901" },
      { name: "Unknown Caller", phone: "(555) 999-1234" },
    ]

    const randomCaller = mockCallers[Math.floor(Math.random() * mockCallers.length)]

    const newMissedCall: MissedCall = {
      id: Date.now().toString(),
      clientName: randomCaller.name,
      phoneNumber: randomCaller.phone,
      timestamp: new Date().toLocaleString(),
      autoTextSent: autoTextEnabled,
      status: "pending",
    }

    setMissedCalls((prev) => [newMissedCall, ...prev])

    toast({
      title: "Missed Call",
      description: `Missed call from ${randomCaller.name} (${randomCaller.phone})`,
    })

    // Auto-send text if enabled
    if (autoTextEnabled) {
      handleAutoText(newMissedCall)
    }
  }

  const handleAutoText = async (call: MissedCall) => {
    try {
      const response = await fetch("/api/missed-calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: call.phoneNumber,
          clientName: call.clientName,
          autoTextEnabled: true,
          message: autoTextMessage,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Auto-text Sent",
          description: `Automatic response sent to ${call.clientName}`,
        })
      }
    } catch (error) {
      console.error("Error sending auto-text:", error)
      toast({
        title: "Error",
        description: "Failed to send auto-text",
        variant: "destructive",
      })
    }
  }

  const startSimulation = () => {
    setIsSimulating(true)
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of missed call
        simulateIncomingCall()
      }
    }, 5000) // Check every 5 seconds

    // Stop simulation after 30 seconds
    setTimeout(() => {
      clearInterval(interval)
      setIsSimulating(false)
    }, 30000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "responded":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "ignored":
        return "bg-red-100 text-red-800"
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
            <h2 className="text-3xl font-bold tracking-tight">Missed Calls</h2>
            <p className="text-muted-foreground">Manage missed calls and automated text responses</p>
          </div>
        </div>
      </div>

      {/* Auto-Text Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Auto-Text Settings
          </CardTitle>
          <CardDescription>Configure automatic text responses for missed calls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="auto-text" checked={autoTextEnabled} onCheckedChange={setAutoTextEnabled} />
            <Label htmlFor="auto-text">Enable automatic text responses</Label>
          </div>

          <div>
            <Label htmlFor="message">Auto-text Message</Label>
            <Textarea
              id="message"
              value={autoTextMessage}
              onChange={(e) => setAutoTextMessage(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={startSimulation} disabled={isSimulating} className="flex items-center gap-2">
              {isSimulating ? (
                <>
                  <Pause className="h-4 w-4" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Call Simulation
                </>
              )}
            </Button>
            <Button onClick={simulateIncomingCall} variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Simulate Missed Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Missed Calls Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Missed Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missedCalls.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-texts Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missedCalls.filter((call) => call.autoTextSent).length}</div>
            <p className="text-xs text-muted-foreground">Automatic responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {missedCalls.length > 0
                ? Math.round(
                    (missedCalls.filter((call) => call.status === "responded").length / missedCalls.length) * 100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Clients who responded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missedCalls.filter((call) => call.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Missed Calls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Missed Calls</CardTitle>
          <CardDescription>Track missed calls and automated responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Auto-text</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missedCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.clientName}</TableCell>
                  <TableCell>{call.phoneNumber}</TableCell>
                  <TableCell>{call.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={call.autoTextSent ? "default" : "secondary"}>
                      {call.autoTextSent ? "Sent" : "Not sent"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
