"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import type { Tenant, PaginatedResponse } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { formatDate, formatCPF } from "@/lib/format-utils"

export default function TenantsPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")

  const pageSize = 20

  useEffect(() => {
    loadTenants()
  }, [page])

  const loadTenants = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.append("search", search)

      const response = await apiClient.request<PaginatedResponse<Tenant>>(`/tenants?${params}`)
      setTenants(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error("[v0] Failed to load tenants:", error)
      // Mock data for demo
      setTenants([
        {
          id: "1",
          full_name: "Carlos Mendes",
          cpf: "12345678901",
          phone: "(11) 98765-4321",
          email: "carlos@example.com",
          city: "São Paulo",
          state: "SP",
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
    loadTenants()
  }

  const columns = [
    {
      key: "full_name",
      label: "Name",
      render: (tenant: Tenant) => (
        <button
          onClick={() => router.push(`/tenants/${tenant.id}`)}
          className="font-medium text-primary hover:underline"
        >
          {tenant.full_name}
        </button>
      ),
    },
    {
      key: "cpf",
      label: "CPF",
      render: (tenant: Tenant) => formatCPF(tenant.cpf),
    },
    {
      key: "contact",
      label: "Contact",
      render: (tenant: Tenant) => (
        <div className="text-sm">
          <div>{tenant.phone || "-"}</div>
          <div className="text-muted-foreground">{tenant.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (tenant: Tenant) => (
        <div className="text-sm">{tenant.city && tenant.state ? `${tenant.city}, ${tenant.state}` : "-"}</div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (tenant: Tenant) => formatDate(tenant.created_at),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">Manage tenant information</p>
        </div>
        <Button onClick={() => router.push("/tenants/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, CPF, or email..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <DataTable
        data={tenants}
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
