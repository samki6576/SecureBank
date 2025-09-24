"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Zap,
  Bell,
  Receipt,
  DollarSign
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/firebase/auth-context"
import { useRouter } from "next/navigation"
import { fetchMockBills } from "@/mockApi"

interface BillData {
  id: string
  name: string
  provider: string
  amount: number
  dueDate: string
  status: string
  category: string
  isAutoPay: boolean
  accountNumber: string
}

export default function BillsPage() {
  const [bills, setBills] = useState<BillData[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadBills()
  }, [user, router])

  const loadBills = async () => {
    try {
      const mockBills = await fetchMockBills()
      setBills(mockBills)
    } catch (error) {
      console.error('Error loading bills:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'utilities': return '⚡'
      case 'internet': return '🌐'
      case 'credit card': return '💳'
      case 'insurance': return '🛡️'
      case 'rent': return '🏠'
      case 'phone': return '📱'
      default: return '📄'
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const toggleAutoPay = (billId: string) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, isAutoPay: !bill.isAutoPay } : bill
    ))
  }

  const handlePayBill = (billId: string) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, status: 'Paid' } : bill
    ))
    alert('Bill paid successfully!')
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Bills & Payments</h1>
          <p className="text-muted-foreground">Manage your recurring bills and payments</p>
        </div>

        {/* Bills Summary */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Due This Month</p>
                <p className="text-3xl font-bold">
                  ${bills.filter(bill => bill.status === 'Pending').reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-primary-foreground/80 text-sm">Auto Pay Bills</p>
                <p className="text-3xl font-bold">
                  {bills.filter(bill => bill.isAutoPay).length}
                </p>
              </div>
              <div>
                <p className="text-primary-foreground/80 text-sm">Overdue Bills</p>
                <p className="text-3xl font-bold">
                  {bills.filter(bill => bill.status === 'Overdue').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bills
                .filter(bill => bill.status === 'Pending')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((bill) => {
                  const daysUntilDue = getDaysUntilDue(bill.dueDate)
                  return (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getCategoryIcon(bill.category)}</div>
                        <div>
                          <h3 className="font-semibold">{bill.name}</h3>
                          <p className="text-sm text-muted-foreground">{bill.provider}</p>
                          <p className="text-xs text-muted-foreground">Account: {bill.accountNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Due in {daysUntilDue} days
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bill.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePayBill(bill.id)}
                        >
                          Pay Now
                        </Button>
                        <Switch
                          checked={bill.isAutoPay}
                          onCheckedChange={() => toggleAutoPay(bill.id)}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* All Bills */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Bills</h2>
          {bills.map((bill) => {
            const daysUntilDue = getDaysUntilDue(bill.dueDate)
            return (
              <Card key={bill.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCategoryIcon(bill.category)}</div>
                      <div>
                        <h3 className="font-semibold">{bill.name}</h3>
                        <p className="text-sm text-muted-foreground">{bill.provider}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(bill.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(bill.status)}
                        {bill.status}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-semibold">{new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account</p>
                      <p className="font-semibold">{bill.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Auto Pay</p>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={bill.isAutoPay}
                          onCheckedChange={() => toggleAutoPay(bill.id)}
                        />
                        <span className="text-sm">{bill.isAutoPay ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {bill.status === 'Pending' && (
                      <Button className="flex-1">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ${bill.amount.toFixed(2)}
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1">
                      <Receipt className="h-4 w-4 mr-2" />
                      View Bill
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Bell className="h-4 w-4 mr-2" />
                      Remind Me
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Add New Bill</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up a new recurring bill
                  </p>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bill
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Auto Pay Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable automatic payments
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Setup Auto Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bill Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {['Utilities', 'Internet', 'Credit Card', 'Insurance', 'Rent', 'Phone'].map((category) => {
                const categoryBills = bills.filter(bill => bill.category === category)
                const totalAmount = categoryBills.reduce((sum, bill) => sum + bill.amount, 0)
                
                return (
                  <div key={category} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-muted-foreground">{categoryBills.length} bills</p>
                      </div>
                      <p className="font-semibold">${totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
