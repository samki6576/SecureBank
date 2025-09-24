"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Send, Plus, Receipt, History } from "lucide-react"
import { useAuth } from "@/components/firebase/auth-context"
import { firestoreService, User, Transaction } from "@/components/firebase/firestore-service"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [userData, setUserData] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      loadUserData()
    }
  }, [user, loading, router])

  const loadUserData = async () => {
    if (!user) return
    
    try {
      const userDoc = await firestoreService.getUserByEmail(user.email!)
      if (userDoc) {
        setUserData(userDoc)
        const userTransactions = await firestoreService.getUserTransactions(userDoc.id!, 3)
        setTransactions(userTransactions)
      } else {
        // Create user document if it doesn't exist
        const userId = await firestoreService.createUser({
          name: user.displayName || user.email!.split('@')[0],
          email: user.email!,
          phone: user.phoneNumber || "",
          balance: 5000, // Default starting balance
          kycVerified: false
        })
        
        // Load the newly created user data
        const newUserDoc = await firestoreService.getUser(userId)
        if (newUserDoc) {
          setUserData(newUserDoc)
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <AppLayout>
      <div className="p-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Good Day!</h1>
            <p className="text-muted-foreground">Welcome back to SecureBank</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">
              {userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary-foreground/80">Total Balance</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setShowBalance(!showBalance)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {showBalance ? `$${(userData?.balance || 5000).toFixed(2)}` : '****'}
              </p>
              <p className="text-primary-foreground/80 text-sm">Account: ****1234</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
            <Send className="h-5 w-5" />
            <span className="text-sm">Send Money</span>
          </Button>
          <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
            <Plus className="h-5 w-5" />
            <span className="text-sm">Add Money</span>
          </Button>
          <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
            <Receipt className="h-5 w-5" />
            <span className="text-sm">Pay Bills</span>
          </Button>
          <Button className="h-16 flex-col gap-2 bg-transparent" variant="outline">
            <History className="h-5 w-5" />
            <span className="text-sm">Transactions</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'receive' || transaction.type === 'deposit' 
                        ? 'bg-green-100' 
                        : 'bg-orange-100'
                    }`}>
                      <span className={`text-sm ${
                        transaction.type === 'receive' || transaction.type === 'deposit' 
                          ? 'text-green-600' 
                          : 'text-orange-600'
                      }`}>
                        {transaction.type === 'receive' || transaction.type === 'deposit' ? '💰' : '💸'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'receive' || transaction.type === 'deposit' 
                      ? 'text-green-600' 
                      : 'text-destructive'
                  }`}>
                    {transaction.type === 'receive' || transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">Your recent transactions will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
