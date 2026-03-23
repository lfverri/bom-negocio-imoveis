"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Property } from "@/lib/types"
import { formatDate } from "@/lib/format-utils"
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

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  AVAILABLE: "default",
  RENTED: "secondary",
  IN_NEGOTIATION: "outline",
  INACTIVE: "destructive",
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  const propertyId = params.id as string

  useEffect(() => {
    loadProperty()
  }, [propertyId])

  const loadProperty = async () => {
    setLoading(true)
    try {
      const data = await apiClient.request<Property>(`/properties/${propertyId}`)
      setProperty(data)
    } catch (error) {
      console.error("[v0] Failed to load property:", error)
      // Mock data for demo
      setProperty({
        id: propertyId,
        landlord_id: "1",
        landlord_name: "Maria Silva Santos",
        property_type: "APARTMENT",
        status: "AVAILABLE",
        street: "Av. Paulista",
        number: "1000",
        complement: "Apt 501",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        postal_code: "01310100",
        registry_number: "12345",
        registry_office: "1º Ofício de Registro de Imóveis",
        iptu_number: "123.456.789-0",
        notes: "Modern apartment with great view. Recently renovated.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.request(`/properties/${propertyId}`, { method: "DELETE" })
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted",
      })
      router.push("/properties")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
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

  if (!property) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Property not found</div>
      </div>
    )
  }

  const safeProperty = {
    ...property,
    property_type: property.property_type || "",
    status: property.status || "AVAILABLE",
    street: property.street || "",
    number: property.number || "",
    complement: property.complement || "",
    neighborhood: property.neighborhood || "",
    city: property.city || "",
    state: property.state || "",
    postal_code: property.postal_code || "",
    registry_number: property.registry_number || "",
    registry_office: property.registry_office || "",
    iptu_number: property.iptu_number || "",
    landlord_name: property.landlord_name || "",
    notes: property.notes || "",
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">
              {safeProperty.property_type.toLowerCase() || "Property"} - {safeProperty.street}, {safeProperty.number}
            </h1>
            <p className="text-muted-foreground">Property details and information</p>
          </div>
        </div>
        <div className="flex gap-2">
          {safeProperty.status === "AVAILABLE" && (
            <Button onClick={() => router.push(`/leases/new?property=${propertyId}`)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Lease
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push(`/properties/${propertyId}/edit`)}>
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
                <AlertDialogTitle>Delete Property</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this property? This action cannot be undone.
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

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leases">Leases</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Type</div>
                  <div className="text-base capitalize">{safeProperty.property_type.toLowerCase() || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="text-base">
                    <Badge variant={statusColors[safeProperty.status] || "default"}>
                      {safeProperty.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Landlord</div>
                  <div className="text-base">
                    <button
                      onClick={() => router.push(`/landlords/${property.landlord_id}`)}
                      className="text-primary hover:underline"
                    >
                      {safeProperty.landlord_name}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created</div>
                  <div className="text-base">{formatDate(property.created_at)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                  <div className="text-base">{formatDate(property.updated_at)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Street Address</div>
                  <div className="text-base">
                    {safeProperty.street}, {safeProperty.number}
                    {safeProperty.complement ? `, ${safeProperty.complement}` : ""}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Neighborhood</div>
                  <div className="text-base">{safeProperty.neighborhood}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">City / State</div>
                  <div className="text-base">
                    {safeProperty.city}, {safeProperty.state}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Postal Code</div>
                  <div className="text-base">{safeProperty.postal_code}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registry Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Registry Number</div>
                  <div className="text-base">{safeProperty.registry_number}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Registry Office</div>
                  <div className="text-base">{safeProperty.registry_office}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">IPTU Number</div>
                  <div className="text-base">{safeProperty.iptu_number || "-"}</div>
                </div>
              </CardContent>
            </Card>

            {safeProperty.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base whitespace-pre-wrap">{safeProperty.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leases">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">No leases found</div>
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
