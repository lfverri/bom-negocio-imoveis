"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Payment, PaginatedResponse } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { formatDate, formatCurrency } from "@/lib/format-utils"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
}

export default function PaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const pageSize = 20

  useEffect(() => {
    loadPayments()
  }, [page, statusFilter])

  const loadPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.append("search", search)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await apiClient.request<PaginatedResponse<Payment>>(`/payments?${params}`)
      setPayments(response.data)
      setTotal(response.total)
    } catch (error) {
      console.error("[v0] Failed to load payments:", error)
      // Mock data for demo
      const today = new Date()
      setPayments([
        {
          id: "1",
          lease_id: "1",
          lease_property: "Av. Paulista, 1000 - Apt 501",
          tenant_name: "Carlos Mendes",
          installment_number: 1,
          competence: "2024-01",
          due_date: "2024-01-10",
          status: "PAID",
          base_amount: 2500,
          total_amount: 2500,
          paid_date: "2024-01-09",
          paid_amount: 2500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          lease_id: "1",
          lease_property: "Av. Paulista, 1000 - Apt 501",
          tenant_name: "Carlos Mendes",
          installment_number: 2,
          competence: "2024-02",
          due_date: today.toISOString().split("T")[0],
          status: "PENDING",
          base_amount: 2500,
          total_amount: 2500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          lease_id: "1",
          lease_property: "Av. Paulista, 1000 - Apt 501",
          tenant_name: "Carlos Mendes",
          installment_number: 3,
          competence: "2023-12",
          due_date: "2023-12-10",
          status: "OVERDUE",
          base_amount: 2500,
          interest_amount: 25,
          penalty_amount: 50,
          total_amount: 2575,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setTotal(3)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadPayments()
  }

  const columns = [
    {
      key: "lease_property",
      label: "Property",
      render: (payment: Payment) => (
        <div className="text-sm">
          <div className="font-medium">{payment.lease_property}</div>
          <div className="text-muted-foreground">{payment.tenant_name}</div>
        </div>
      ),
    },
    {
      key: "competence",
      label: "Period",
    },
    {
      key: "due_date",
      label: "Due Date",
      render: (payment: Payment) => formatDate(payment.due_date),
    },
    {
      key: "status",
      label: "Status",
      render: (payment: Payment) => <Badge variant={statusColors[payment.status] || "default"}>{payment.status}</Badge>,
    },
    {
      key: "total_amount",
      label: "Amount",
      render: (payment: Payment) => (
        <div className="text-sm">
          <div className="font-medium">{formatCurrency(payment.total_amount)}</div>
          {payment.interest_amount || payment.penalty_amount ? (
            <div className="text-xs text-muted-foreground">
              {payment.interest_amount ? `+${formatCurrency(payment.interest_amount)} interest` : ""}
              {payment.penalty_amount ? ` +${formatCurrency(payment.penalty_amount)} penalty` : ""}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "paid_date",
      label: "Paid Date",
      render: (payment: Payment) => (payment.paid_date ? formatDate(payment.paid_date) : "-"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (payment: Payment) => (
        <Button size="sm" variant="outline" onClick={() => router.push(`/payments/${payment.id}`)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage rental payments and installments</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by property or tenant..."
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={payments}
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
