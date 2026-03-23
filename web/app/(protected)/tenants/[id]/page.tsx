"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Tenant } from "@/lib/types"
import { formatDate, formatCPF, formatCurrency } from "@/lib/format-utils"
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

export default function TenantDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)

  const tenantId = params.id as string

  useEffect(() => {
    loadTenant()
  }, [tenantId])

  const loadTenant = async () => {
    setLoading(true)
    try {
      const data = await apiClient.request<Tenant>(`/tenants/${tenantId}`)
      setTenant(data)
    } catch (error) {
      console.error("[v0] Failed to load tenant:", error)
      // Mock data for demo
      setTenant({
        id: tenantId,
        full_name: "Carlos Mendes",
        cpf: "12345678901",
        rg: "MG-12.345.678",
        date_of_birth: "1985-05-15",
        marital_status: "MARRIED",
        occupation: "Software Engineer",
        monthly_income: 8500,
        phone: "(11) 98765-4321",
        email: "carlos@example.com",
        street: "Rua das Flores",
        number: "123",
        complement: "Apt 45",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        postal_code: "01310100",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.request(`/tenants/${tenantId}`, { method: "DELETE" })
      toast({
        title: "Tenant Deleted",
        description: "The tenant has been successfully deleted",
      })
      router.push("/tenants")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tenant",
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

  if (!tenant) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Tenant not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/tenants")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tenant.full_name}</h1>
            <p className="text-muted-foreground">Tenant details and information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/tenants/${tenantId}/edit`)}>
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
                <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this tenant? This action cannot be undone.
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

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="leases">Leases</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">CPF</div>
                  <div className="text-base">{formatCPF(tenant.cpf)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">RG</div>
                  <div className="text-base">{tenant.rg || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                  <div className="text-base">{tenant.date_of_birth ? formatDate(tenant.date_of_birth) : "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Marital Status</div>
                  <div className="text-base capitalize">{tenant.marital_status?.toLowerCase() || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Occupation</div>
                  <div className="text-base">{tenant.occupation || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Monthly Income</div>
                  <div className="text-base">{tenant.monthly_income ? formatCurrency(tenant.monthly_income) : "-"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact & Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div className="text-base">{tenant.phone || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="text-base">{tenant.email || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div className="text-base">
                    {tenant.street && tenant.number ? (
                      <>
                        {tenant.street}, {tenant.number}
                        {tenant.complement ? `, ${tenant.complement}` : ""}
                        <br />
                        {tenant.neighborhood}
                        <br />
                        {tenant.city}, {tenant.state} {tenant.postal_code}
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created</div>
                  <div className="text-base">{formatDate(tenant.created_at)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="references">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No references added yet</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leases">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No leases found</div>
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
