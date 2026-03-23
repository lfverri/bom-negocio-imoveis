"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InsurancePolicy, PaginatedResponse } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { formatDate, formatCurrency } from "@/lib/format-utils"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  EXPIRED: "destructive",
  CANCELLED: "secondary",
}

export default function InsurancePage() {
  const router = useRouter()
  const [policies, setPolicies] = useState<InsurancePolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const pageSize = 20

  useEffect(() => {
    loadPolicies()
  }, [page, statusFilter])

  const loadPolicies = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.append("search", search)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await apiClient.request<PaginatedResponse<InsurancePolicy>>(`/insurance-policies?${params}`)
      setPolicies(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error("[v0] Failed to load insurance policies:", error)
      // Mock data for demo
      setPolicies([
        {
          id: "1",
          lease_id: "1",
          lease_property: "Av. Paulista, 1000 - Apt 501",
          tenant_name: "Carlos Mendes",
          insurance_type_id: "1",
          insurance_type_name: "Fire Insurance",
          insurer_name: "Seguradora Brasil",
          policy_number: "POL-2024-001",
          insured_amount: 150000,
          start_date: "2024-01-01",
          end_date: "2025-01-01",
          status: "ACTIVE",
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
    loadPolicies()
  }

  const columns = [
    {
      key: "lease_property",
      label: "Lease",
      render: (policy: InsurancePolicy) => (
        <div className="text-sm">
          <div className="font-medium">{policy.lease_property}</div>
          <div className="text-muted-foreground">{policy.tenant_name}</div>
        </div>
      ),
    },
    {
      key: "insurance_type_name",
      label: "Type",
    },
    {
      key: "insurer_name",
      label: "Insurer",
    },
    {
      key: "policy_number",
      label: "Policy Number",
    },
    {
      key: "insured_amount",
      label: "Insured Amount",
      render: (policy: InsurancePolicy) => formatCurrency(policy.insured_amount),
    },
    {
      key: "period",
      label: "Period",
      render: (policy: InsurancePolicy) => (
        <div className="text-sm">
          <div>{formatDate(policy.start_date)}</div>
          <div className="text-muted-foreground">{formatDate(policy.end_date)}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (policy: InsurancePolicy) => (
        <Badge variant={statusColors[policy.status] || "default"}>{policy.status}</Badge>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insurance Policies</h1>
          <p className="text-muted-foreground">Manage property insurance</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by property or policy number..."
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
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={policies}
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
