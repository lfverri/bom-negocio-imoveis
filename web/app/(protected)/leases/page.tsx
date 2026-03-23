"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Lease, PaginatedResponse } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { formatDate, formatCurrency } from "@/lib/format-utils"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  ACTIVE: "default",
  ENDED: "secondary",
  CANCELLED: "destructive",
}

export default function LeasesPage() {
  const router = useRouter()
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const pageSize = 20

  useEffect(() => {
    loadLeases()
  }, [page, statusFilter])

  const loadLeases = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.append("search", search)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await apiClient.request<PaginatedResponse<Lease>>(`/leases?${params}`)
      setLeases(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error("[v0] Failed to load leases:", error)
      // Mock data for demo
      setLeases([
        {
          id: "1",
          property_id: "1",
          property_address: "Av. Paulista, 1000 - Apt 501",
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setTotal(1)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadLeases()
  }

  const columns = [
    {
      key: "property_address",
      label: "Property",
      render: (lease: Lease) => (
        <button onClick={() => router.push(`/leases/${lease.id}`)} className="font-medium text-primary hover:underline">
          {lease.property_address}
        </button>
      ),
    },
    {
      key: "tenant_name",
      label: "Tenant",
    },
    {
      key: "landlord_name",
      label: "Landlord",
    },
    {
      key: "status",
      label: "Status",
      render: (lease: Lease) => <Badge variant={statusColors[lease.status] || "default"}>{lease.status}</Badge>,
    },
    {
      key: "dates",
      label: "Period",
      render: (lease: Lease) => (
        <div className="text-sm">
          <div>{formatDate(lease.start_date)}</div>
          <div className="text-muted-foreground">{formatDate(lease.end_date)}</div>
        </div>
      ),
    },
    {
      key: "rent_amount",
      label: "Rent",
      render: (lease: Lease) => formatCurrency(lease.rent_amount),
    },
    {
      key: "due_day",
      label: "Due Day",
      render: (lease: Lease) => `Day ${lease.due_day}`,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leases</h1>
          <p className="text-muted-foreground">Manage rental contracts</p>
        </div>
        <Button onClick={() => router.push("/leases/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Lease
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by property, tenant, or landlord..."
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
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ENDED">Ended</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={leases}
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
