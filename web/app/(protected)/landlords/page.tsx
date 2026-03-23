"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import type { Landlord, PaginatedResponse } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { formatDate, formatCPF, formatCNPJ } from "@/lib/format-utils"

export default function LandlordsPage() {
  const router = useRouter()
  const [landlords, setLandlords] = useState<Landlord[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")

  const pageSize = 20

  useEffect(() => {
    loadLandlords()
  }, [page])

  const loadLandlords = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.append("search", search)

      const response = await apiClient.request<PaginatedResponse<Landlord>>(`/landlords?${params}`)
      setLandlords(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error("[v0] Failed to load landlords:", error)
      // Mock data for demo
      setLandlords([
        {
          id: "1",
          person_type: "INDIVIDUAL",
          legal_name: "Maria Silva Santos",
          cpf: "98765432101",
          phone: "(11) 91234-5678",
          email: "maria.santos@example.com",
          city: "São Paulo",
          state: "SP",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          person_type: "COMPANY",
          legal_name: "Imobiliária Premium Ltda",
          cnpj: "12345678000199",
          phone: "(11) 3456-7890",
          email: "contato@premium.com.br",
          city: "São Paulo",
          state: "SP",
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
    loadLandlords()
  }

  const columns = [
    {
      key: "legal_name",
      label: "Name",
      render: (landlord: Landlord) => (
        <button
          onClick={() => router.push(`/landlords/${landlord.id}`)}
          className="font-medium text-primary hover:underline"
        >
          {landlord.legal_name}
        </button>
      ),
    },
    {
      key: "person_type",
      label: "Type",
      render: (landlord: Landlord) => (
        <Badge variant={landlord.person_type === "INDIVIDUAL" ? "secondary" : "outline"}>
          {landlord.person_type === "INDIVIDUAL" ? "Individual" : "Company"}
        </Badge>
      ),
    },
    {
      key: "document",
      label: "CPF/CNPJ",
      render: (landlord: Landlord) => {
        if (landlord.cpf) return formatCPF(landlord.cpf)
        if (landlord.cnpj) return formatCNPJ(landlord.cnpj)
        return "-"
      },
    },
    {
      key: "contact",
      label: "Contact",
      render: (landlord: Landlord) => (
        <div className="text-sm">
          <div>{landlord.phone || "-"}</div>
          <div className="text-muted-foreground">{landlord.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (landlord: Landlord) => (
        <div className="text-sm">{landlord.city && landlord.state ? `${landlord.city}, ${landlord.state}` : "-"}</div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (landlord: Landlord) => formatDate(landlord.created_at),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landlords</h1>
          <p className="text-muted-foreground">Manage property owners</p>
        </div>
        <Button onClick={() => router.push("/landlords/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Landlord
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, CPF/CNPJ, or email..."
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
        data={landlords}
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
