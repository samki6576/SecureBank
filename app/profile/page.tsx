import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, Shield, Bell, CreditCard, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      href: "/profile/personal",
      description: "Update your personal details",
    },
    {
      icon: Shield,
      label: "Security & Privacy",
      href: "/profile/security",
      description: "Manage passwords and security settings",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/profile/notifications",
      description: "Control your notification preferences",
    },
    {
      icon: CreditCard,
      label: "Linked Accounts",
      href: "/profile/accounts",
      description: "Manage connected bank accounts and cards",
    },
    {
      icon: Settings,
      label: "App Settings",
      href: "/profile/settings",
      description: "Theme, language, and app preferences",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/profile/help",
      description: "Get help and contact support",
    },
  ]

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-muted-foreground">john.doe@email.com</p>
                <p className="text-sm text-muted-foreground">Member since Dec 2023</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/personal">Edit</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.href} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-0">
                  <Link href={item.href} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Logout Button */}
        <Card className="border-destructive/20">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
