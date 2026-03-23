"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Inspection, PaginatedResponse } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { formatDate } from "@/lib/format-utils"

const typeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  MOVE_IN: "default",
  MOVE_OUT: "secondary",
  ROUTINE: "outline",
  MAINTENANCE: "destructive",
}

export default function InspectionsPage() {
  const router = useRouter()
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const pageSize = 20

  useEffect(() => {
    loadInspections()
  }, [page, typeFilter])

  const loadInspections = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.append("search", search)
      if (typeFilter !== "all") params.append("type", typeFilter)

      const response = await apiClient.request<PaginatedResponse<Inspection>>(`/inspections?${params}`)
      setInspections(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error("[v0] Failed to load inspections:", error)
      // Mock data for demo
      setInspections([
        {
          id: "1",
          property_id: "1",
          property_address: "Av. Paulista, 1000 - Apt 501",
          lease_id: "1",
          inspection_type: "MOVE_IN",
          inspection_date: "2024-01-01",
          summary: "Property in excellent condition. All appliances working properly.",
          condition_rating: 5,
          performed_by_name: "João Inspector",
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
    loadInspections()
  }

  const columns = [
    {
      key: "property_address",
      label: "Property",
      render: (inspection: Inspection) => (
        <button
          onClick={() => router.push(`/properties/${inspection.property_id}`)}
          className="font-medium text-primary hover:underline"
        >
          {inspection.property_address}
        </button>
      ),
    },
    {
      key: "inspection_type",
      label: "Type",
      render: (inspection: Inspection) => (
        <Badge variant={typeColors[inspection.inspection_type] || "default"}>
          {inspection.inspection_type.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "inspection_date",
      label: "Date",
      render: (inspection: Inspection) => formatDate(inspection.inspection_date),
    },
    {
      key: "condition_rating",
      label: "Rating",
      render: (inspection: Inspection) => (
        <div className="flex items-center gap-1">
          {inspection.condition_rating ? (
            <>
              <span className="font-medium">{inspection.condition_rating}</span>
              <span className="text-muted-foreground">/ 5</span>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      key: "performed_by_name",
      label: "Inspector",
    },
    {
      key: "summary",
      label: "Summary",
      render: (inspection: Inspection) => <div className="text-sm max-w-md truncate">{inspection.summary || "-"}</div>,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">Manage property inspections</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by property..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="MOVE_IN">Move In</SelectItem>
            <SelectItem value="MOVE_OUT">Move Out</SelectItem>
            <SelectItem value="ROUTINE">Routine</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={inspections}
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
