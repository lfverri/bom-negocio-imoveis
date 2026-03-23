"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function LeadHistoryPage() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Status History</h2>

      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">No status changes recorded yet</div>
        </CardContent>
      </Card>
    </div>
  )
}
