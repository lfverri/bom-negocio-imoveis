"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Tab = {
  name: string
  href: string
}

export function TabsNavigation({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <nav className="flex gap-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
