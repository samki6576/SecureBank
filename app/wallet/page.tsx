"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and cards</p>
        </div>

        {/* Balance Overview */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary-foreground/80">Available Balance</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setShowBalance(!showBalance)}
              >
                <span className="h-4 w-4 inline-block">
                  {showBalance ? "👁️" : "🙈"}
                </span>
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {showBalance ? `$${5000.0.toFixed(2)}` : "****"}
              </p>
              <p className="text-primary-foreground/80 text-sm">Account: ****1234</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
            <Link href="/wallet/add-funds">
              <CreditCard className="h-6 w-6" />
              <span>Add Money</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
            <Link href="/transfers">
              <ArrowUpRight className="h-6 w-6" />
              <span>Send Money</span>
            </Link>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Added from Bank</p>
                  <p className="text-sm text-muted-foreground">Today, 2:30 PM</p>
                </div>
              </div>
              <span className="font-semibold text-green-600">+$500.00</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Sent to John Doe</p>
                  <p className="text-sm text-muted-foreground">Yesterday, 4:15 PM</p>
                </div>
              </div>
              <span className="font-semibold text-destructive">-$150.00</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Card Payment</p>
                  <p className="text-sm text-muted-foreground">Dec 15, 10:22 AM</p>
                </div>
              </div>
              <span className="font-semibold text-destructive">-$89.50</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
