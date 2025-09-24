"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Settings,
  Trash2,
  Eye,
  EyeOff,
  DollarSign,
  Shield,
  CreditCard
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/firebase/auth-context"
import { useRouter } from "next/navigation"
import { fetchMockNotifications } from "@/mockApi"

interface NotificationData {
  id: string
  title: string
  message: string
  type: string
  timestamp: string
  isRead: boolean
  actionUrl: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
    transactions: true,
    security: true,
    bills: true,
    investments: false,
    marketing: false
  })
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadNotifications()
  }, [user, router])

  const loadNotifications = async () => {
    try {
      const mockNotifications = await fetchMockNotifications()
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'info': return <Info className="h-5 w-5 text-blue-600" />
      default: return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success': return 'border-green-200 bg-green-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'alert': return 'border-red-200 bg-red-50'
      case 'info': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (!user) return null

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your account activity</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={unreadCount > 0 ? "destructive" : "secondary"}>
              {unreadCount} unread
            </Badge>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all ${!notification.isRead ? 'ring-2 ring-primary/20' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {getTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.isRead).map((notification) => (
              <Card key={notification.id} className="ring-2 ring-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <p className="text-sm mt-1 text-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {getTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {notifications.filter(n => n.type === 'success' || n.title.toLowerCase().includes('payment')).map((notification) => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Delivery Methods</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, push: checked }))
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, email: checked }))
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                      </div>
                      <Switch
                        checked={notificationSettings.sms}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, sms: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Transaction Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified about transactions</p>
                      </div>
                      <Switch
                        checked={notificationSettings.transactions}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, transactions: checked }))
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified about security events</p>
                      </div>
                      <Switch
                        checked={notificationSettings.security}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, security: checked }))
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Bill Reminders</p>
                        <p className="text-sm text-muted-foreground">Get reminded about upcoming bills</p>
                      </div>
                      <Switch
                        checked={notificationSettings.bills}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, bills: checked }))
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Investment Updates</p>
                        <p className="text-sm text-muted-foreground">Get updates about your investments</p>
                      </div>
                      <Switch
                        checked={notificationSettings.investments}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, investments: checked }))
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Marketing Messages</p>
                        <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketing}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, marketing: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
