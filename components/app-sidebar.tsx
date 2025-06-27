import {
  BarChart3,
  Users,
  MessageSquare,
  Megaphone,
  Star,
  Bell,
  HelpCircle,
  Settings,
  Brain,
  PhoneOff,
} from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "CRM",
    url: "/crm",
    icon: Users,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "AI Chat",
    url: "/chat",
    icon: Brain,
  },
  {
    title: "Missed Calls",
    url: "/missed-calls",
    icon: PhoneOff,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Megaphone,
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: Star,
  },
  {
    title: "Reminders",
    url: "/reminders",
    icon: Bell,
  },
  {
    title: "Quiz Funnels",
    url: "/quiz-funnels",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r transition-colors duration-300">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <Brain className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-foreground truncate">ClientSync AI</h1>
            <p className="text-xs text-muted-foreground truncate">Therapist Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-muted/50"
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
