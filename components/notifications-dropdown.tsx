"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, Star, UserPlus, Calendar, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "message" | "review" | "lead" | "appointment" | "system"
  title: string
  description: string
  time: string
  read: boolean
  icon: React.ComponentType<{ className?: string }>
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "lead",
    title: "New lead captured",
    description: "Sarah Johnson completed the anxiety assessment quiz",
    time: "5 minutes ago",
    read: false,
    icon: UserPlus,
  },
  {
    id: "2",
    type: "review",
    title: "New 5-star review",
    description: "Mike Chen left a positive review on Google",
    time: "1 hour ago",
    read: false,
    icon: Star,
  },
  {
    id: "3",
    type: "message",
    title: "Message received",
    description: "Emma Davis replied to your check-in message",
    time: "2 hours ago",
    read: true,
    icon: MessageSquare,
  },
  {
    id: "4",
    type: "appointment",
    title: "Appointment confirmed",
    description: "John Smith confirmed tomorrow's 2 PM session",
    time: "3 hours ago",
    read: true,
    icon: Calendar,
  },
  {
    id: "5",
    type: "system",
    title: "Backup completed",
    description: "Daily data backup completed successfully",
    time: "6 hours ago",
    read: true,
    icon: CheckCircle,
  },
]

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "lead":
        return "text-blue-600"
      case "review":
        return "text-yellow-600"
      case "message":
        return "text-green-600"
      case "appointment":
        return "text-purple-600"
      case "system":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start space-x-3 p-3 cursor-pointer ${
                !notification.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                <notification.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
