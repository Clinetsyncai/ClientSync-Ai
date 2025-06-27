import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Chat</h2>
          <p className="text-muted-foreground">Direct chat interface with your AI therapy assistant</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <ChatInterface />
      </div>
    </div>
  )
}
