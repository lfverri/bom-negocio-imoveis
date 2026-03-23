"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Property, PaginatedResponse } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { formatDate } from "@/lib/format-utils"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  AVAILABLE: "default",
  RENTED: "secondary",
  IN_NEGOTIATION: "outline",
  INACTIVE: "destructive",
}

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("")

  const pageSize = 20

  useEffect(() => {
    loadProperties()
  }, [page, statusFilter])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.append("search", search)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (cityFilter) params.append("city", cityFilter)

      const response = await apiClient.request<PaginatedResponse<Property>>(`/properties?${params}`)
      setProperties(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error("[v0] Failed to load properties:", error)
      // Mock data for demo
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
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          postal_code: "01310100",
          registry_number: "12345",
          registry_office: "1º Ofício de Registro de Imóveis",
          iptu_number: "123.456.789-0",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          landlord_id: "2",
          landlord_name: "Imobiliária Premium Ltda",
          property_type: "HOUSE",
          status: "RENTED",
          street: "Rua das Flores",
          number: "456",
          neighborhood: "Jardim Europa",
          city: "São Paulo",
          state: "SP",
          postal_code: "01452000",
          registry_number: "67890",
          registry_office: "2º Ofício de Registro de Imóveis",
          iptu_number: "987.654.321-0",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setTotal(2)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadProperties()
  }

  const columns = [
    {
      key: "property_type",
      label: "Type",
      render: (property: Property) => (
        <button
          onClick={() => router.push(`/properties/${property.id}`)}
          className="font-medium text-primary hover:underline capitalize"
        >
          {property.property_type.toLowerCase()}
        </button>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (property: Property) => (
        <Badge variant={statusColors[property.status] || "default"}>{property.status.replace("_", " ")}</Badge>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (property: Property) => (
        <div className="text-sm">
          <div>
            {property.street}, {property.number}
            {property.complement ? `, ${property.complement}` : ""}
          </div>
          <div className="text-muted-foreground">
            {property.neighborhood} - {property.city}, {property.state}
          </div>
        </div>
      ),
    },
    {
      key: "landlord_name",
      label: "Landlord",
    },
    {
      key: "registry_number",
      label: "Registry",
    },
    {
      key: "iptu_number",
      label: "IPTU",
    },
    {
      key: "created_at",
      label: "Created",
      render: (property: Property) => formatDate(property.created_at),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage property listings</p>
        </div>
        <Button onClick={() => router.push("/properties/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by address, registry, or IPTU..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="RENTED">Rented</SelectItem>
            <SelectItem value="IN_NEGOTIATION">In Negotiation</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={properties}
        columns={columns}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  )
}
