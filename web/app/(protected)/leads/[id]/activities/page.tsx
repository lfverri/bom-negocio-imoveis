"use client"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LeadActivitiesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activities</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">No activities recorded yet</div>
        </CardContent>
      </Card>
    </div>
  )
}
