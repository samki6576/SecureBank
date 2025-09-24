"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Download,
  Calendar,
  Eye,
  FileText,
  Calculator
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/firebase/auth-context"
import { useRouter } from "next/navigation"
import { fetchMockReports } from "@/mockApi"

interface ReportData {
  monthly: {
    income: number
    expenses: number
    savings: number
    categories: Array<{
      name: string
      amount: number
      percentage: number
    }>
  }
  yearly: {
    totalIncome: number
    totalExpenses: number
    totalSavings: number
    netWorth: number
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadReports()
  }, [user, router])

  const loadReports = async () => {
    try {
      const mockReports = await fetchMockReports()
      setReports(mockReports)
    } catch (error) {
      console.error('Error loading reports:', error)
    }
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ]
    return colors[index % colors.length]
  }

  if (!user || !reports) return null

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track your financial performance and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
                <SelectItem value="quarterly">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${selectedPeriod === 'yearly' ? reports.yearly.totalIncome.toLocaleString() : reports.monthly.income.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${selectedPeriod === 'yearly' ? reports.yearly.totalExpenses.toLocaleString() : reports.monthly.expenses.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedPeriod === 'yearly' ? reports.yearly.totalSavings.toLocaleString() : reports.monthly.savings.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Worth</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${reports.yearly.netWorth.toLocaleString()}
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Expense Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.monthly.categories.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(index)}`}></div>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">${category.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Spending Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Spending Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-8 bg-muted rounded-lg">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">Interactive chart would be displayed here</p>
                      <p className="text-xs text-muted-foreground mt-2">Showing spending patterns over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">+{((reports.monthly.income / reports.monthly.expenses - 1) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Income vs Expenses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{(reports.monthly.savings / reports.monthly.income * 100).toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Savings Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">${(reports.monthly.expenses / 30).toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">Daily Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.monthly.categories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getCategoryColor(index)}`}></div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}% of total expenses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${category.amount.toFixed(2)}</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${getCategoryColor(index)}`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Income Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Salary</p>
                      <p className="text-sm text-muted-foreground">Primary employment income</p>
                    </div>
                    <p className="font-semibold">${(reports.monthly.income * 0.8).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Investment Returns</p>
                      <p className="text-sm text-muted-foreground">Dividends and capital gains</p>
                    </div>
                    <p className="font-semibold">${(reports.monthly.income * 0.15).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Other Income</p>
                      <p className="text-sm text-muted-foreground">Freelance and side projects</p>
                    </div>
                    <p className="font-semibold">${(reports.monthly.income * 0.05).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-lg font-semibold text-green-600">Income Growth</p>
                    <p className="text-sm text-muted-foreground">+12.5% from last month</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-lg font-semibold text-blue-600">Savings Growth</p>
                    <p className="text-sm text-muted-foreground">+8.3% from last month</p>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <TrendingDown className="h-8 w-8 mx-auto text-red-600 mb-2" />
                    <p className="text-lg font-semibold text-red-600">Expense Reduction</p>
                    <p className="text-sm text-muted-foreground">-5.2% from last month</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-lg font-semibold text-purple-600">Net Worth</p>
                    <p className="text-sm text-muted-foreground">+15.7% from last year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <FileText className="h-5 w-5" />
            <span>Generate Report</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-5 w-5" />
            <span>Set Budget</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Eye className="h-5 w-5" />
            <span>View Details</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
