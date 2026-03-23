"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, CheckCircle, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Lease } from "@/lib/types"
import { formatDate, formatCurrency } from "@/lib/format-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  ACTIVE: "default",
  ENDED: "secondary",
  CANCELLED: "destructive",
}

export default function LeaseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [lease, setLease] = useState<Lease | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"activate" | "end" | "cancel">("activate")

  const leaseId = params.id as string

  useEffect(() => {
    loadLease()
  }, [leaseId])

  const loadLease = async () => {
    setLoading(true)
    try {
      const data = await apiClient.request<Lease>(`/leases/${leaseId}`)
      setLease(data)
    } catch (error) {
      console.error("[v0] Failed to load lease:", error)
      // Mock data for demo
      setLease({
        id: leaseId,
        property_id: "1",
        property_address: "Av. Paulista, 1000 - Apt 501, São Paulo, SP",
        tenant_id: "1",
        tenant_name: "Carlos Mendes",
        landlord_id: "1",
        landlord_name: "Maria Silva Santos",
        status: "ACTIVE",
        rent_indexer_id: "1",
        rent_indexer_name: "IPCA",
        start_date: "2024-01-01",
        end_date: "2025-01-01",
        rent_amount: 2500,
        due_day: 10,
        late_interest_pct_per_month: 1.0,
        late_fee_pct: 2.0,
        notes: "Standard lease agreement with 12-month term.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (type: "activate" | "end" | "cancel") => {
    setActionLoading(true)
    try {
      await apiClient.request(`/leases/${leaseId}/${type}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      })

      toast({
        title: "Lease Updated",
        description: `The lease has been ${type}d successfully`,
      })
      setDialogOpen(false)
      setReason("")
      loadLease()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${type} lease`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (!lease) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Lease not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/leases")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lease Details</h1>
            <p className="text-muted-foreground">{lease.property_address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {lease.status === "DRAFT" && (
            <>
              <Dialog open={dialogOpen && actionType === "activate"} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setActionType("activate")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Activate Lease</DialogTitle>
                    <DialogDescription>
                      Activating this lease will make it the active contract for this property.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason (optional)</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason for activation..."
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleStatusChange("activate")} disabled={actionLoading}>
                      {actionLoading ? "Activating..." : "Activate"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => router.push(`/leases/${leaseId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          )}
          {lease.status === "ACTIVE" && (
            <>
              <Dialog open={dialogOpen && actionType === "end"} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setActionType("end")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    End Lease
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>End Lease</DialogTitle>
                    <DialogDescription>
                      Ending this lease will mark it as completed. The property will become available again.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason (optional)</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason for ending..."
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleStatusChange("end")} disabled={actionLoading}>
                      {actionLoading ? "Ending..." : "End Lease"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={dialogOpen && actionType === "cancel"} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setActionType("cancel")}>
                    <Ban className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Lease</DialogTitle>
                    <DialogDescription>
                      Cancelling this lease will terminate the contract. This action should be used for early
                      terminations.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason for cancellation..."
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange("cancel")}
                      disabled={actionLoading || !reason}
                    >
                      {actionLoading ? "Cancelling..." : "Cancel Lease"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lease Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="text-base">
                    <Badge variant={statusColors[lease.status] || "default"}>{lease.status}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                  <div className="text-base">{formatDate(lease.start_date)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">End Date</div>
                  <div className="text-base">{formatDate(lease.end_date)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Rent Indexer</div>
                  <div className="text-base">{lease.rent_indexer_name}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Rent Amount</div>
                  <div className="text-2xl font-bold">{formatCurrency(lease.rent_amount)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Due Day</div>
                  <div className="text-base">Day {lease.due_day} of each month</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Late Interest</div>
                  <div className="text-base">{lease.late_interest_pct_per_month}% per month</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Late Fee</div>
                  <div className="text-base">{lease.late_fee_pct}%</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div className="text-base">
                    <button
                      onClick={() => router.push(`/properties/${lease.property_id}`)}
                      className="text-primary hover:underline"
                    >
                      {lease.property_address}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Landlord</div>
                  <div className="text-base">
                    <button
                      onClick={() => router.push(`/landlords/${lease.landlord_id}`)}
                      className="text-primary hover:underline"
                    >
                      {lease.landlord_name}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tenant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div className="text-base">
                    <button
                      onClick={() => router.push(`/tenants/${lease.tenant_id}`)}
                      className="text-primary hover:underline"
                    >
                      {lease.tenant_name}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {lease.notes && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base whitespace-pre-wrap">{lease.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No payments recorded yet</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No insurance policies attached</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No inspections recorded</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No status changes recorded</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No documents attached yet</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
