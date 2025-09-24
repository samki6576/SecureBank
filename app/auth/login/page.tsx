"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Eye, EyeOff, Fingerprint } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/firebasecon"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please check your credentials.")
    }
  }

  const handleBiometricLogin = () => {
    // Simulate biometric login
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col pt-safe">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/welcome">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Welcome back</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Phone</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email or phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 touch-manipulation">
                  Sign In
                </Button>
              </form>

              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Forgot password?
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <Button variant="outline" className="w-full h-12 gap-2 bg-transparent touch-manipulation" onClick={handleBiometricLogin}>
                <Fingerprint className="h-5 w-5" />
                Use Biometric Login
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <Button variant="link" asChild className="p-0 h-auto text-sm">
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
