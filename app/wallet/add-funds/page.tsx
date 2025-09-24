"use client"

import type React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddFundsPage() {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<"card" | "bank">("card")
  const router = useRouter()

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate adding funds
    router.push("/wallet")
  }

  const quickAmounts = [50, 100, 200, 500]

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/wallet">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Add Funds</h1>
        </div>

        <form onSubmit={handleAddFunds} className="space-y-6">
          {/* Amount Input */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 text-lg h-12"
                    required
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="bg-transparent"
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  method === "card" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setMethod("card")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Debit/Credit Card</p>
                    <p className="text-sm text-muted-foreground">Instant transfer</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  method === "bank" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setMethod("bank")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">1-2 business days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {amount && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount to add:</span>
                  <span className="font-semibold text-lg">${amount}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full h-12" disabled={!amount}>
            Add ${amount || "0.00"}
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
