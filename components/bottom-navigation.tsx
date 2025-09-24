"use client"

import { Home, Wallet, ArrowLeftRight, CreditCard, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/transfers", icon: ArrowLeftRight, label: "Transfers" },
  { href: "/cards", icon: CreditCard, label: "Cards" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around py-3 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all duration-200 min-h-[60px] justify-center touch-manipulation",
                isActive 
                  ? "text-primary bg-primary/10 scale-105" 
                  : "text-muted-foreground active:scale-95 active:bg-muted/50",
              )}
            >
              <Icon className={cn(
                "h-6 w-6 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium transition-all",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
