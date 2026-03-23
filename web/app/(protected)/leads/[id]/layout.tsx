"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { TabsNavigation } from "@/components/tabs-navigation"

export default function LeadDetailsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const leadId = params.id as string

  const tabs = [
    { name: "Overview", href: `/leads/${leadId}` },
    { name: "Activities", href: `/leads/${leadId}/activities` },
    { name: "Status History", href: `/leads/${leadId}/history` },
    { name: "Documents", href: `/leads/${leadId}/documents` },
  ]

  return (
    <div className="space-y-6">
      <TabsNavigation tabs={tabs} />
      {children}
    </div>
  )
}
