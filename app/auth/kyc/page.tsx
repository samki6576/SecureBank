"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Camera, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function KYCPage() {
  const [step, setStep] = useState(1)
  const [idUploaded, setIdUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)
  const router = useRouter()

  const handleIdUpload = () => {
    // Simulate file upload
    setIdUploaded(true)
  }

  const handleSelfieUpload = () => {
    // Simulate selfie capture
    setSelfieUploaded(true)
  }

  const handleComplete = () => {
    // Simulate KYC completion
    router.push("/")
  }

  const canProceed = idUploaded && selfieUploaded

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/signup">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Identity Verification</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-2 bg-muted rounded-full">
            <div className="h-full bg-primary rounded-full w-2/3"></div>
          </div>
          <span className="text-sm text-muted-foreground">Step 2 of 3</span>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Verify Your Identity</CardTitle>
              <p className="text-center text-muted-foreground text-sm">
                We need to verify your identity to keep your account secure
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ID Upload */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  1. Upload Government ID
                  {idUploaded && <CheckCircle className="h-4 w-4 text-green-600" />}
                </h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {idUploaded ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                      <p className="text-sm text-green-600">ID uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Upload a clear photo of your driver's license or passport
                      </p>
                      <Button onClick={handleIdUpload} variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Selfie Upload */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  2. Take a Selfie
                  {selfieUploaded && <CheckCircle className="h-4 w-4 text-green-600" />}
                </h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {selfieUploaded ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                      <p className="text-sm text-green-600">Selfie captured successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Take a clear selfie to match with your ID</p>
                      <Button onClick={handleSelfieUpload} variant="outline" size="sm">
                        Take Selfie
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleComplete} disabled={!canProceed} className="w-full h-12">
                Complete Verification
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your information is encrypted and secure. We'll never share your personal data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
