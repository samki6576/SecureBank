"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, QrCode, Users, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/firebase/auth-context"
import { firestoreService } from "@/components/firebase/firestore-service"

export default function TransfersPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // Get current user data
      const userDoc = await firestoreService.getUserByEmail(user.email!)
      if (!userDoc) {
        alert('User not found')
        return
      }

      const transferAmount = parseFloat(amount)
      if (userDoc.balance < transferAmount) {
        alert('Insufficient balance')
        return
      }

      // Create transaction record
      await firestoreService.createTransaction({
        userId: userDoc.id!,
        type: 'send',
        amount: transferAmount,
        recipient: recipient,
        description: `Transfer to ${recipient}`,
        category: 'Transfer'
      })

      // Update user balance
      await firestoreService.updateUserBalance(userDoc.id!, userDoc.balance - transferAmount)

      alert('Transfer successful!')
      router.push("/")
    } catch (error) {
      console.error('Transfer failed:', error)
      alert('Transfer failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const recentContacts = [
    { name: "John Doe", phone: "+1 (555) 123-4567", avatar: "JD" },
    { name: "Sarah Wilson", phone: "+1 (555) 987-6543", avatar: "SW" },
    { name: "Mike Johnson", phone: "+1 (555) 456-7890", avatar: "MJ" },
  ]

  return (
    <AppLayout>
      <div className="p-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Send Money</h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Button variant="outline" className="h-16 sm:h-20 flex-col gap-2 bg-transparent touch-manipulation">
            <QrCode className="h-6 w-6" />
            <span className="text-sm font-medium">Scan QR Code</span>
          </Button>
          <Button variant="outline" className="h-16 sm:h-20 flex-col gap-2 bg-transparent touch-manipulation">
            <Phone className="h-6 w-6" />
            <span className="text-sm font-medium">Phone Number</span>
          </Button>
        </div>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentContacts.map((contact) => (
              <div
                key={contact.phone}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setRecipient(contact.phone)}
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">{contact.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Transfer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient (Phone or Email)</Label>
                <Input
                  id="recipient"
                  placeholder="Enter phone number or email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="What's this for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Summary */}
              {amount && recipient && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">{recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold text-lg">${amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-12" disabled={!amount || !recipient || loading}>
                {loading ? 'Processing...' : `Send $${amount || "0.00"}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
