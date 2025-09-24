"use client"


import type React from "react"
import { BottomNavigation } from "./bottom-navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-specific safe area handling */}
      <main className={`${isMobile ? 'pb-20 pt-safe' : 'pb-20'} max-w-md mx-auto relative`}>
        {children}
      </main>
      <BottomNavigation />
      
      {/* Mobile-specific styles */}
      <style jsx global>{`
        @supports (padding: max(0px)) {
          .pt-safe {
            padding-top: max(env(safe-area-inset-top), 1rem);
          }
          .pb-safe {
            padding-bottom: max(env(safe-area-inset-bottom), 1rem);
          }
          .pl-safe {
            padding-left: max(env(safe-area-inset-left), 1rem);
          }
          .pr-safe {
            padding-right: max(env(safe-area-inset-right), 1rem);
          }
        }
        
        /* Prevent zoom on input focus on iOS */
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="number"],
        input[type="tel"],
        textarea,
        select {
          font-size: 16px;
        }
        
        /* Smooth scrolling for mobile */
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Touch-friendly tap targets */
        button, a, [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }
      `}</style>
    </div>
  )
}
