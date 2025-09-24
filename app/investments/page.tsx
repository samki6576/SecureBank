"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  DollarSign, 
  Plus,
  BarChart3,
  Target,
  Zap
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/firebase/auth-context"
import { useRouter } from "next/navigation"
import { fetchMockInvestments } from "@/mockApi"

interface InvestmentData {
  id: string
  name: string
  symbol: string
  type: string
  shares: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
  lastUpdated: string
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentData[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadInvestments()
  }, [user, router])

  const loadInvestments = async () => {
    try {
      const mockInvestments = await fetchMockInvestments()
      setInvestments(mockInvestments)
    } catch (error) {
      console.error('Error loading investments:', error)
    }
  }

  const getTotalValue = () => {
    return investments.reduce((sum, investment) => sum + investment.totalValue, 0)
  }

  const getTotalGainLoss = () => {
    return investments.reduce((sum, investment) => sum + investment.gainLoss, 0)
  }

  const getTotalGainLossPercent = () => {
    const totalValue = getTotalValue()
    const totalGainLoss = getTotalGainLoss()
    return totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stock': return '📈'
      case 'mutual fund': return '🏦'
      case 'cryptocurrency': return '₿'
      case 'bond': return '📊'
      default: return '💼'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stock': return 'bg-blue-100 text-blue-800'
      case 'mutual fund': return 'bg-green-100 text-green-800'
      case 'cryptocurrency': return 'bg-orange-100 text-orange-800'
      case 'bond': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Investments</h1>
          <p className="text-muted-foreground">Track your investment portfolio</p>
        </div>

        {/* Portfolio Summary */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Portfolio Value</p>
                <p className="text-3xl font-bold">${getTotalValue().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Gain/Loss</p>
                <div className="flex items-center gap-2">
                  {getTotalGainLoss() >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <p className="text-3xl font-bold">
                    ${Math.abs(getTotalGainLoss()).toLocaleString()}
                  </p>
                </div>
                <p className={`text-sm ${
                  getTotalGainLoss() >= 0 ? 'text-green-200' : 'text-red-200'
                }`}>
                  {getTotalGainLossPercent().toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-600">+12.5%</p>
                <p className="text-sm text-muted-foreground">1M Return</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-blue-600">+8.3%</p>
                <p className="text-sm text-muted-foreground">3M Return</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-purple-600">+15.7%</p>
                <p className="text-sm text-muted-foreground">1Y Return</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-orange-600">+22.1%</p>
                <p className="text-sm text-muted-foreground">All Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Holdings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Holdings</h2>
          {investments.map((investment) => (
            <Card key={investment.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTypeIcon(investment.type)}</div>
                    <div>
                      <h3 className="font-semibold">{investment.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{investment.symbol}</p>
                        <Badge className={getTypeColor(investment.type)}>
                          {investment.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${investment.totalValue.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      {investment.gainLoss >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-sm ${
                        investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {investment.gainLoss >= 0 ? '+' : ''}${investment.gainLoss.toFixed(2)}
                      </p>
                    </div>
                    <p className={`text-xs ${
                      investment.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.gainLossPercent >= 0 ? '+' : ''}{investment.gainLossPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Shares</p>
                    <p className="font-medium">{investment.shares}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Price</p>
                    <p className="font-medium">${investment.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {new Date(investment.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy More
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Sell
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <h3 className="font-semibold">Start Investing</h3>
                  <p className="text-sm text-muted-foreground">
                    Add new investments to your portfolio
                  </p>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Investment Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Set and track your financial goals
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Manage Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Market Up</span>
                </div>
                <p className="text-xs text-green-700">
                  S&P 500 gained 1.2% today. Technology stocks leading the rally.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Diversification</span>
                </div>
                <p className="text-xs text-blue-700">
                  Consider adding international stocks to diversify your portfolio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}