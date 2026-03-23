"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">System configuration and preferences</p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <SettingsIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Settings Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Configure rent indexers, insurance types, and lead sources
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
