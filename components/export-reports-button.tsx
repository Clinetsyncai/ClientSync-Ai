"use client"

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
import { useToast } from "@/hooks/use-toast"
import { Download, FileText, FileSpreadsheet, Calendar, Users, TrendingUp } from "lucide-react"

interface ExportData {
  clients: Array<{
    name: string
    email: string
    phone: string
    status: string
    totalSessions: number
    lastContact: string
  }>
  activities: Array<{
    client: string
    action: string
    time: string
    type: string
  }>
  stats: {
    totalClients: number
    messagesThisMonth: number
    appointmentsThisWeek: number
    responseRate: number
  }
}

const mockExportData: ExportData = {
  clients: [
    {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 123-4567",
      status: "Active",
      totalSessions: 24,
      lastContact: "2024-01-15",
    },
    {
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "(555) 234-5678",
      status: "Follow-up",
      totalSessions: 6,
      lastContact: "2024-01-10",
    },
    {
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "(555) 345-6789",
      status: "Active",
      totalSessions: 18,
      lastContact: "2024-01-13",
    },
  ],
  activities: [
    {
      client: "Sarah Johnson",
      action: "Sent automated check-in",
      time: "2 minutes ago",
      type: "message",
    },
    {
      client: "Mike Chen",
      action: "Missed call - auto-reply sent",
      time: "15 minutes ago",
      type: "call",
    },
    {
      client: "Emma Davis",
      action: "Left 5-star review",
      time: "1 hour ago",
      type: "review",
    },
  ],
  stats: {
    totalClients: 127,
    messagesThisMonth: 342,
    appointmentsThisWeek: 28,
    responseRate: 94,
  },
}

export function ExportReportsButton() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Escape commas and quotes in CSV
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    downloadFile(csvContent, `${filename}.csv`, "text/csv")
  }

  const generatePDF = async (reportType: string) => {
    // In a real implementation, you'd use a library like jsPDF or html2pdf
    // For now, we'll create a simple HTML report and trigger print
    const reportContent = generateHTMLReport(reportType)

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(reportContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const generateHTMLReport = (reportType: string) => {
    const currentDate = new Date().toLocaleDateString()

    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ClientSync AI - ${reportType} Report</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 40px; color: #1f2937; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .date { color: #6b7280; margin-top: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
          .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
          .stat-value { font-size: 32px; font-weight: bold; color: #3b82f6; }
          .stat-label { color: #6b7280; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background-color: #f9fafb; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">ClientSync AI</div>
          <div class="date">Report generated on ${currentDate}</div>
        </div>
    `

    if (reportType === "Dashboard Summary") {
      content += `
        <h1>Dashboard Summary Report</h1>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${mockExportData.stats.totalClients}</div>
            <div class="stat-label">Total Clients</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${mockExportData.stats.messagesThisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${mockExportData.stats.appointmentsThisWeek}</div>
            <div class="stat-label">Appointments This Week</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${mockExportData.stats.responseRate}%</div>
            <div class="stat-label">Response Rate</div>
          </div>
        </div>
        
        <h2>Recent Activity</h2>
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Action</th>
              <th>Time</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            ${mockExportData.activities
              .map(
                (activity) => `
              <tr>
                <td>${activity.client}</td>
                <td>${activity.action}</td>
                <td>${activity.time}</td>
                <td>${activity.type}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
    } else if (reportType === "Client List") {
      content += `
        <h1>Client List Report</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Total Sessions</th>
              <th>Last Contact</th>
            </tr>
          </thead>
          <tbody>
            ${mockExportData.clients
              .map(
                (client) => `
              <tr>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.status}</td>
                <td>${client.totalSessions}</td>
                <td>${client.lastContact}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
    }

    content += `
        <div class="footer">
          <p>This report was generated by ClientSync AI - Professional Therapist Dashboard</p>
          <p>© 2024 ClientSync AI. All rights reserved.</p>
        </div>
      </body>
      </html>
    `

    return content
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleExport = async (type: "csv" | "pdf", reportType: string) => {
    setIsExporting(true)

    try {
      if (type === "csv") {
        if (reportType === "Client List") {
          generateCSV(mockExportData.clients, "client-list")
        } else if (reportType === "Activity Report") {
          generateCSV(mockExportData.activities, "activity-report")
        } else {
          // Dashboard summary as CSV
          const summaryData = [
            { metric: "Total Clients", value: mockExportData.stats.totalClients },
            { metric: "Messages This Month", value: mockExportData.stats.messagesThisMonth },
            { metric: "Appointments This Week", value: mockExportData.stats.appointmentsThisWeek },
            { metric: "Response Rate", value: `${mockExportData.stats.responseRate}%` },
          ]
          generateCSV(summaryData, "dashboard-summary")
        }
      } else {
        await generatePDF(reportType)
      }

      toast({
        title: "Export Successful",
        description: `${reportType} exported as ${type.toUpperCase()} successfully`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the report",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting} className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export Reports"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("pdf", "Dashboard Summary")} className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Dashboard Summary (PDF)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("csv", "Client List")} className="gap-2">
          <Users className="h-4 w-4" />
          Client List (CSV)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("csv", "Activity Report")} className="gap-2">
          <Calendar className="h-4 w-4" />
          Activity Report (CSV)
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("csv", "Dashboard Summary")} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Full Dashboard (CSV)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("pdf", "Client List")} className="gap-2">
          <FileText className="h-4 w-4" />
          Client Report (PDF)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
