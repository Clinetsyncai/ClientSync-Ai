"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Save, User, CreditCard, Users, Palette, Upload, Crown, Shield, Plus, Trash2 } from "lucide-react"
import { ColorPicker } from "@/components/color-picker"

export default function SettingsPage() {
  const { toast } = useToast()

  /* ---------- STATE ---------- */
  const [therapistSettings, setTherapistSettings] = useState({
    therapistName: "Dr. Angela Martinez",
    specialties: "Anxiety, Depression, CBT, EMDR",
    tone: "professional",
  })

  const [businessSettings, setBusinessSettings] = useState({
    practiceName: "Mindful Therapy",
    email: "dr.martinez@mindfultherapy.com",
    phone: "(555) 123-4567",
    address: "123 Wellness Ave, Suite 200, New York, NY 10001",
  })

  const [brandingSettings, setBrandingSettings] = useState({
    clinicName: "Mindful Therapy",
    logo: null as File | null,
    accentColor: "#3B82F6",
  })

  const [teamMembers] = useState([
    {
      id: "1",
      name: "Dr. Angela Martinez",
      email: "dr.martinez@mindfultherapy.com",
      role: "Owner",
      status: "Active",
      lastActive: "Now",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@mindfultherapy.com",
      role: "Assistant",
      status: "Active",
      lastActive: "2 hours ago",
    },
  ])

  const [apiSettings, setApiSettings] = useState({
    openaiKey: "sk-proj-••••••••••••••••",
    twilioSid: "AC••••••••••••••••••••••••••••••••",
    twilioToken: "••••••••••••••••••••••••••••••••••",
    mailgunKey: "key-••••••••••••••••••••••••••••••••",
  })

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  /* ---------- HELPERS ---------- */
  const mask = (val: string, keyName: string) => (showKeys[keyName] ? val : "•".repeat(val.length))

  const toggleKeyVisibility = (keyName: string) => {
    setShowKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }))
  }

  const handleSaveTherapistSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(therapistSettings),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Therapist settings were updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    }
  }

  const handleSave = (section: string) =>
    toast({
      title: "Settings saved",
      description: `${section} settings were updated successfully.`,
    })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBrandingSettings({ ...brandingSettings, logo: file })
    }
  }

  /* ---------- RENDER ---------- */
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Configure your practice and integration details</p>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="therapist" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="therapist">Therapist</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="subscription">Billing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* ---------- THERAPIST TAB ---------- */}
        <TabsContent value="therapist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Therapist Information
              </CardTitle>
              <CardDescription>Update your professional details and specialties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="therapistName">Therapist Name</Label>
                <Input
                  id="therapistName"
                  value={therapistSettings.therapistName}
                  onChange={(e) =>
                    setTherapistSettings({
                      ...therapistSettings,
                      therapistName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="specialties">Specialties</Label>
                <Textarea
                  id="specialties"
                  value={therapistSettings.specialties}
                  onChange={(e) =>
                    setTherapistSettings({
                      ...therapistSettings,
                      specialties: e.target.value,
                    })
                  }
                  placeholder="e.g., Anxiety, Depression, CBT, EMDR, Trauma Therapy"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tone">Communication Tone</Label>
                <Select
                  value={therapistSettings.tone}
                  onValueChange={(value) =>
                    setTherapistSettings({
                      ...therapistSettings,
                      tone: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="empathetic">Empathetic</SelectItem>
                    <SelectItem value="supportive">Supportive</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveTherapistSettings} className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                Save Therapist Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- BUSINESS TAB ---------- */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Update your practice details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="practiceName">Practice Name</Label>
                  <Input
                    id="practiceName"
                    value={businessSettings.practiceName}
                    onChange={(e) =>
                      setBusinessSettings({
                        ...businessSettings,
                        practiceName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) =>
                      setBusinessSettings({
                        ...businessSettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={businessSettings.phone}
                    onChange={(e) =>
                      setBusinessSettings({
                        ...businessSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={businessSettings.address}
                    onChange={(e) =>
                      setBusinessSettings({
                        ...businessSettings,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("Business")} className="mt-2">
                <Save className="mr-2 h-4 w-4" />
                Save Business Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- BRANDING TAB ---------- */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Clinic Branding
              </CardTitle>
              <CardDescription>Customize your dashboard appearance and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="clinicName">Clinic Name (Dashboard Header)</Label>
                <Input
                  id="clinicName"
                  value={brandingSettings.clinicName}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, clinicName: e.target.value })}
                  placeholder="Your Clinic Name"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will replace "ClientSync AI" in the dashboard header
                </p>
              </div>

              <div>
                <Label htmlFor="logo">Clinic Logo</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-16 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                    {brandingSettings.logo ? (
                      <img
                        src={URL.createObjectURL(brandingSettings.logo) || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Button variant="outline" onClick={() => document.getElementById("logo")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 64x64px, PNG or SVG</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <ColorPicker />
              </div>

              <Button onClick={() => handleSave("Branding")}>
                <Save className="mr-2 h-4 w-4" />
                Save Branding Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- TEAM TAB ---------- */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>Manage team access and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">Manage who has access to your ClientSync AI dashboard</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === "Owner" ? "default" : "secondary"}>{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                      </TableCell>
                      <TableCell>{member.lastActive}</TableCell>
                      <TableCell>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- SUBSCRIPTION TAB ---------- */}
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>Manage your subscription and payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold">Professional Plan</h3>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      $99/month • Unlimited clients • AI features included
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$99</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Next Billing Date</Label>
                  <p className="text-sm font-medium mt-1">February 15, 2024</p>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <p className="text-sm font-medium mt-1">•••• •••• •••• 4242</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Plan Features</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Unlimited clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>AI-powered responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>HIPAA compliance</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Update Payment Method</Button>
                <Button variant="outline">Download Invoice</Button>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- INTEGRATIONS TAB ---------- */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys & Integrations</CardTitle>
              <CardDescription>Manage your third-party service credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiSettings).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 items-end">
                  <div className="col-span-2">
                    <Label htmlFor={key}>
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    <Input id={key} value={mask(value, key)} readOnly />
                  </div>
                  <Button type="button" variant="outline" onClick={() => toggleKeyVisibility(key)}>
                    {showKeys[key] ? "Hide" : "Show"}
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleSave("Integrations")}>
                <Save className="mr-2 h-4 w-4" />
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
