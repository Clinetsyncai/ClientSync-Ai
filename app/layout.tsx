import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ColorPickerProvider } from "@/components/color-picker-provider"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "ClientSync AI - Professional Therapist Dashboard",
  description: "Enterprise-grade AI-powered practice management for mental health professionals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="clientsync-ui-theme">
          <ColorPickerProvider defaultColor="#3B82F6" storageKey="clientsync-button-color">
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </SidebarProvider>
            <Toaster />
          </ColorPickerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
