"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Property, Tenant, RentIndexer } from "@/lib/types"

export default function NewLeasePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [indexers, setIndexers] = useState<RentIndexer[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [formData, setFormData] = useState({
    property_id: searchParams.get("property") || "",
    tenant_id: "",
    rent_indexer_id: "",
    start_date: "",
    end_date: "",
    rent_amount: "",
    due_day: "10",
    late_interest_pct_per_month: "1.00",
    late_fee_pct: "2.00",
    notes: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (formData.property_id) {
      const property = properties.find((p) => p.id === formData.property_id)
      setSelectedProperty(property || null)
    }
  }, [formData.property_id, properties])

  const loadData = async () => {
    try {
      const [propsRes, tenantsRes, indexersRes] = await Promise.all([
        apiClient.request<{ data: Property[] }>("/properties?status=AVAILABLE&pageSize=100"),
        apiClient.request<{ data: Tenant[] }>("/tenants?pageSize=100"),
        apiClient.request<{ data: RentIndexer[] }>("/rent-indexers"),
      ])
      setProperties(propsRes.data)
      setTenants(tenantsRes.data)
      setIndexers(indexersRes.data)
    } catch (error) {
      console.error("[v0] Failed to load data:", error)
      // Mock data
      setProperties([
        {
          id: "1",
          landlord_id: "1",
          landlord_name: "Maria Silva Santos",
          property_type: "APARTMENT",
          status: "AVAILABLE",
          street: "Av. Paulista",
          number: "1000",
          complement: "Apt 501",
          city: "São Paulo",
          state: "SP",
          registry_number: "12345",
          registry_office: "1º Ofício",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setTenants([
        {
          id: "1",
          full_name: "Carlos Mendes",
          cpf: "12345678901",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setIndexers([
        { id: "1", name: "IPCA", code: "IPCA", description: "Índice de Preços ao Consumidor Amplo" },
        { id: "2", name: "IGP-M", code: "IGPM", description: "Índice Geral de Preços do Mercado" },
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate dates
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    // Validate due day
    const dueDay = Number.parseInt(formData.due_day)
    if (dueDay < 1 || dueDay > 28) {
      toast({
        title: "Invalid Due Day",
        description: "Due day must be between 1 and 28",
        variant: "destructive",
      })
      return
    }

    // Validate rent amount
    const rentAmount = Number.parseFloat(formData.rent_amount)
    if (rentAmount <= 0) {
      toast({
        title: "Invalid Rent Amount",
        description: "Rent amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await apiClient.request("/leases", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          rent_amount: rentAmount,
          due_day: dueDay,
          late_interest_pct_per_month: Number.parseFloat(formData.late_interest_pct_per_month),
          late_fee_pct: Number.parseFloat(formData.late_fee_pct),
        }),
      })

      toast({
        title: "Lease Created",
        description: "The lease has been successfully created",
      })
      router.push("/leases")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create lease",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Lease</h1>
          <p className="text-muted-foreground">Create a rental contract</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Only one ACTIVE lease per property is allowed. Dates cannot overlap with existing leases.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="property_id">
                  Property <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.property_id}
                  onValueChange={(value) => setFormData({ ...formData, property_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.street}, {property.number} - {property.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProperty && (
                <div className="md:col-span-2 p-4 bg-muted rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium">Landlord (auto-filled)</div>
                    <div className="text-muted-foreground">{selectedProperty.landlord_name}</div>
                  </div>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tenant_id">
                  Tenant <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.tenant_id}
                  onValueChange={(value) => setFormData({ ...formData, tenant_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lease Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rent_amount">
                  Rent Amount (R$) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rent_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.rent_amount}
                  onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rent_indexer_id">
                  Rent Indexer <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.rent_indexer_id}
                  onValueChange={(value) => setFormData({ ...formData, rent_indexer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select indexer" />
                  </SelectTrigger>
                  <SelectContent>
                    {indexers.map((indexer) => (
                      <SelectItem key={indexer.id} value={indexer.id}>
                        {indexer.name} - {indexer.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_day">
                  Due Day (1-28) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="due_day"
                  type="number"
                  min="1"
                  max="28"
                  value={formData.due_day}
                  onChange={(e) => setFormData({ ...formData, due_day: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="late_interest_pct_per_month">Late Interest (% per month)</Label>
                <Input
                  id="late_interest_pct_per_month"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.late_interest_pct_per_month}
                  onChange={(e) => setFormData({ ...formData, late_interest_pct_per_month: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="late_fee_pct">Late Fee (%)</Label>
                <Input
                  id="late_fee_pct"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.late_fee_pct}
                  onChange={(e) => setFormData({ ...formData, late_fee_pct: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Additional notes about this lease..."
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Lease (Draft)"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
