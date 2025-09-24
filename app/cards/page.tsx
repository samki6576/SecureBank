"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  CreditCard, 
  Plus, 
  Eye, 
  EyeOff, 
  Settings, 
  Shield, 
  TrendingUp,
  Lock,
  Unlock
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/firebase/auth-context"
import { useRouter } from "next/navigation"
import { fetchMockCards } from "@/mockApi"

interface CardData {
  id: string
  type: string
  number: string
  holderName: string
  expiryDate: string
  cvv: string
  balance: number
  cardProvider: string
  isActive: boolean
  spendingLimit: number
  usedAmount: number
}

export default function CardsPage() {
  const [cards, setCards] = useState<CardData[]>([])
  const [showCardNumbers, setShowCardNumbers] = useState(false)
  const [showCVV, setShowCVV] = useState<{ [key: string]: boolean }>({})
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadCards()
  }, [user, router])

  const loadCards = async () => {
    try {
      const mockCards = await fetchMockCards()
      setCards(mockCards)
    } catch (error) {
      console.error('Error loading cards:', error)
    }
  }

  const toggleCardStatus = (cardId: string) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, isActive: !card.isActive } : card
    ))
  }

  const toggleCVV = (cardId: string) => {
    setShowCVV(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  const getCardProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'visa': return 'bg-blue-600'
      case 'mastercard': return 'bg-red-600'
      case 'amex': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  const getCardTypeIcon = (type: string) => {
    return type === 'credit' ? '💳' : '💳'
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="p-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Cards</h1>
          <p className="text-muted-foreground">Manage your credit and debit cards</p>
        </div>

        {/* Cards List */}
        <div className="space-y-4">
          {cards.map((card) => (
            <Card key={card.id} className="overflow-hidden touch-manipulation">
              <CardContent className="p-0">
                {/* Card Front */}
                <div className={`${getCardProviderColor(card.cardProvider)} text-white p-4 sm:p-6 relative`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCardTypeIcon(card.type)}</span>
                      <span className="font-semibold">{card.cardProvider}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={card.isActive ? "default" : "secondary"}>
                        {card.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={() => toggleCardStatus(card.id)}
                      >
                        {card.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/80 text-sm">Card Number</p>
                      <p className="text-xl font-mono">
                        {showCardNumbers ? card.number : "•••• •••• •••• ••••"}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white/80 text-sm">Cardholder</p>
                        <p className="font-semibold">{card.holderName}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Expires</p>
                        <p className="font-semibold">{card.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">CVV</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono">
                            {showCVV[card.id] ? card.cvv : "•••"}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-1 h-auto"
                            onClick={() => toggleCVV(card.id)}
                          >
                            {showCVV[card.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className={`text-lg font-semibold ${
                        (card.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(card.balance || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.type === 'credit' ? 'Credit Limit' : 'Spending Limit'}
                      </p>
                      <p className="text-lg font-semibold">
                        ${(card.spendingLimit || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {card.type === 'credit' && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Credit Used</span>
                        <span className="text-sm font-medium">
                          ${(card.usedAmount || 0).toFixed(2)} / ${(card.spendingLimit || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${card.spendingLimit > 0 ? (card.usedAmount / card.spendingLimit) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Card */}
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Add New Card</h3>
                <p className="text-sm text-muted-foreground">
                  Apply for a new credit or debit card
                </p>
              </div>
              <Button className="w-full">
                Apply for New Card
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Card Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-600">$2,450</p>
                <p className="text-sm text-muted-foreground">Total Spending</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-blue-600">$1,250</p>
                <p className="text-sm text-muted-foreground">Available Credit</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-orange-600">12</p>
                <p className="text-sm text-muted-foreground">Transactions</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-purple-600">$89</p>
                <p className="text-sm text-muted-foreground">Average Transaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}