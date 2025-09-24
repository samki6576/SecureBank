"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Calculator,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/firebase/auth-context"
import { useRouter } from "next/navigation"
import { fetchMockLoans } from "@/mockApi"

interface LoanData {
  id: string
  type: string
  amount: number
  outstandingBalance: number
  interestRate: number
  monthlyPayment: number
  nextPaymentDate: string
  status: string
  termMonths: number
  remainingMonths: number
}

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanData[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadLoans()
  }, [user, router])

  const loadLoans = async () => {
    try {
      const mockLoans = await fetchMockLoans()
      setLoans(mockLoans)
    } catch (error) {
      console.error('Error loading loans:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'default': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'default': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const calculateProgress = (loan: LoanData) => {
    return ((loan.termMonths - loan.remainingMonths) / loan.termMonths) * 100
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Loans</h1>
          <p className="text-muted-foreground">Manage your loans and credit</p>
        </div>

        {/* Loan Summary */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Outstanding</p>
                <p className="text-3xl font-bold">
                  ${loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-primary-foreground/80 text-sm">Monthly Payments</p>
                <p className="text-3xl font-bold">
                  ${loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Loans */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Loans</h2>
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{loan.type}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {loan.termMonths - loan.remainingMonths} of {loan.termMonths} payments made
                    </p>
                  </div>
                  <Badge className={getStatusColor(loan.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Payment Progress</span>
                    <span className="text-sm font-medium">
                      {Math.round(calculateProgress(loan))}%
                    </span>
                  </div>
                  <Progress value={calculateProgress(loan)} className="h-2" />
                </div>

                {/* Loan Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Original Amount</p>
                      <p className="font-semibold">${loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold">{loan.interestRate}% APR</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Payment</p>
                      <p className="font-semibold text-primary">${loan.monthlyPayment.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                      <p className="font-semibold">${loan.outstandingBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining Payments</p>
                      <p className="font-semibold">{loan.remainingMonths} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Payment Due</p>
                      <p className="font-semibold">{new Date(loan.nextPaymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loan Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-blue-600">$25,000</p>
                <p className="text-sm text-muted-foreground">Personal Loan</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-600">$150,000</p>
                <p className="text-sm text-muted-foreground">Home Loan</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-purple-600">$10,000</p>
                <p className="text-sm text-muted-foreground">Auto Loan</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-orange-600">$5,000</p>
                <p className="text-sm text-muted-foreground">Credit Line</p>
              </div>
            </div>
            <Button className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Apply for New Loan
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <Calendar className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-semibold">Payment Schedule</h3>
                <p className="text-sm text-muted-foreground">View upcoming payments</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-semibold">Loan Statements</h3>
                <p className="text-sm text-muted-foreground">Download statements</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Statements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}