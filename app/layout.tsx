import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/firebase/auth-context'
import { AppLayout } from '@/components/app-layout'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: {
    default: 'SecureBank - Mobile Banking',
    template: '%s | SecureBank'
  },
  description: 'Secure mobile banking app with all features you need',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SecureBank',
  },
  icons: {
    icon: [
      { url: "/r.png", sizes: "32x32" },
      { url: "/r.png", type: "image/png", sizes: "192x192" },
      { url: "/r.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/r.png", type: "image/png", sizes: "180x180" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} h-full`}>
        <AuthProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}