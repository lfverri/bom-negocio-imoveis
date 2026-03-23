"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCPF } from "@/lib/format-utils"

export default function ProfilePage() {
  const { user } = useAuth()
  const [editMode, setEditMode] = useState(false)

  if (!user) return null

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Full Name</div>
              <div className="text-base">{user.full_name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="text-base">{user.email || "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">CPF</div>
              <div className="text-base">{user.cpf ? formatCPF(user.cpf) : "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div className="text-base">{user.phone || "-"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="text-base">{user.is_active ? "Active" : "Inactive"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Member Since</div>
              <div className="text-base">{formatDate(user.created_at)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input id="current_password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input id="new_password" type="password" />
            </div>
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
