"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  TrendingUp, 
  FileText, 
  Bell, 
  Settings, 
  Shield,
  DollarSign,
  PieChart,
  HelpCircle,
  LogOut,
  User,
  Calendar,
  Phone,
  Mail,
  Globe
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/firebase/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function MorePage() {
  const [unreadNotifications, setUnreadNotifications] = useState(3)
  const [pendingBills, setPendingBills] = useState(2)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">More</h1>
          <p className="text-muted-foreground">Access all banking features and services</p>
        </div>

        {/* User Profile Card */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Welcome back!</h2>
                <p className="text-primary-foreground/80">{user.email}</p>
                <p className="text-sm text-primary-foreground/60">Premium Banking Member</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banking Services */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Banking Services</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <Link href="/loans" className="block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Loans</h3>
                      <p className="text-sm text-muted-foreground">Personal & Home</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Link href="/investments" className="block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Investments</h3>
                      <p className="text-sm text-muted-foreground">Portfolio & Trading</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Link href="/bills" className="block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Bills & Payments</h3>
                      <p className="text-sm text-muted-foreground">Manage bills</p>
                      {pendingBills > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {pendingBills} pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Link href="/reports" className="block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <PieChart className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Reports</h3>
                      <p className="text-sm text-muted-foreground">Analytics & Insights</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Management */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Management</h2>
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Link href="/notifications" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Manage alerts and updates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotifications > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadNotifications}
                      </Badge>
                    )}
                    <span className="text-muted-foreground">›</span>
                  </div>
                </Link>

                <Link href="/profile/settings" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Settings</p>
                      <p className="text-sm text-muted-foreground">Preferences and security</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </Link>

                <Link href="/profile/personal" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Personal Information</p>
                      <p className="text-sm text-muted-foreground">Update your profile</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </Link>

                <Link href="/security" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Security Center</p>
                      <p className="text-sm text-muted-foreground">Account security settings</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support & Help */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Support & Help</h2>
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Link href="/help" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Help Center</p>
                      <p className="text-sm text-muted-foreground">FAQs and support articles</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </Link>

                <Link href="/contact" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Contact Us</p>
                      <p className="text-sm text-muted-foreground">Get in touch with support</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </Link>

                <Link href="/feedback" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Send Feedback</p>
                      <p className="text-sm text-muted-foreground">Share your thoughts</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Information */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">SecureBank Mobile App</p>
              <p className="text-xs text-muted-foreground">Version 2.1.0</p>
              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-4">
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
