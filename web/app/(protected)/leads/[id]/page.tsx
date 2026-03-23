"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Lead } from "@/lib/types"
import { formatDate, formatCurrency } from "@/lib/format-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LeadOverviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  const leadId = params.id as string

  useEffect(() => {
    loadLead()
  }, [leadId])

  const loadLead = async () => {
    setLoading(true)
    try {
      const data = await apiClient.request<Lead>(`/leads/${leadId}`)
      setLead(data)
    } catch (error) {
      console.error("[v0] Failed to load lead:", error)
      // Mock data for demo
      setLead({
        id: leadId,
        full_name: "João Silva",
        phone: "(11) 98765-4321",
        email: "joao@example.com",
        source: "WEBSITE",
        status: "NEW",
        interest_region: "São Paulo - Centro",
        interest_property_type: "APARTMENT",
        budget_min: 200000,
        budget_max: 350000,
        assigned_user_name: "Maria Santos",
        notes: "Interested in 2-bedroom apartments with parking. Prefers ground floor.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.request(`/leads/${leadId}`, { method: "DELETE" })
      toast({
        title: "Lead Deleted",
        description: "The lead has been successfully deleted",
      })
      router.push("/leads")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Lead not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/leads")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{lead.full_name}</h1>
            <p className="text-muted-foreground">Lead details and information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/leads/${leadId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lead? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div className="text-base">{lead.phone || "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="text-base">{lead.email || "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Source</div>
              <div className="text-base capitalize">{lead.source.toLowerCase().replace("_", " ")}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="text-base">
                <StatusBadge status={lead.status} />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Assigned To</div>
              <div className="text-base">{lead.assigned_user_name || "Unassigned"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interest & Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Property Type</div>
              <div className="text-base">{lead.interest_property_type || "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Region</div>
              <div className="text-base">{lead.interest_region || "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Budget Range</div>
              <div className="text-base">
                {lead.budget_min || lead.budget_max ? (
                  <>
                    {lead.budget_min ? formatCurrency(lead.budget_min) : "Any"} -{" "}
                    {lead.budget_max ? formatCurrency(lead.budget_max) : "Any"}
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="text-base">{formatDate(lead.created_at)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="text-base">{formatDate(lead.updated_at)}</div>
            </div>
          </CardContent>
        </Card>

        {lead.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base whitespace-pre-wrap">{lead.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
