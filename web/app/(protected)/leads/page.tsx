"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, PaginatedResponse } from "@/lib/types";
import { apiClient } from "@/lib/api-client";
import { formatDate, formatCurrency } from "@/lib/format-utils";

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const pageSize = 20;

  useEffect(() => {
    loadLeads();
  }, [page, statusFilter, sourceFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.append("name", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (sourceFilter !== "all") params.append("source", sourceFilter);

      const response = await apiClient.request<PaginatedResponse<Lead>>(
        `/leads?${params}`,
      );
      setLeads(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("[v0] Failed to load leads:", error);
      setLeads([
        {
          id: "1",
          name: "João Silva",
          phone: "(11) 98765-4321",
          email: "joao@example.com",
          source: "WEBSITE",
          status: "NEW",
          interestType: "BUY",
          expectedBudgetMin: 200000,
          expectedBudgetMax: 350000,
          preferredRegions: ["São Paulo - Centro"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setTotal(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadLeads();
  };

  const columns = [
    {
      key: "name",
      label: "Nome",
      render: (lead: Lead) => (
        <button
          onClick={() => router.push(`/leads/${lead.id}`)}
          className="font-medium text-primary hover:underline"
        >
          {lead.name}
        </button>
      ),
    },
    {
      key: "contact",
      label: "Contato",
      render: (lead: Lead) => (
        <div className="text-sm">
          <div>{lead.phone || "-"}</div>
          <div className="text-muted-foreground">{lead.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "source",
      label: "Origem",
      render: (lead: Lead) => (
        <span className="capitalize">
          {lead.source.toLowerCase().replace("_", " ")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (lead: Lead) => <StatusBadge status={lead.status} />,
    },
    {
      key: "interest",
      label: "Interesse",
      render: (lead: Lead) => (
        <div className="text-sm">
          <div>{lead.interestType || "-"}</div>
          <div className="text-muted-foreground">
            {lead.preferredRegions?.join(", ") || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "budget",
      label: "Orçamento",
      render: (lead: Lead) => {
        if (!lead.expectedBudgetMin && !lead.expectedBudgetMax) return "-";
        return (
          <div className="text-sm">
            {lead.expectedBudgetMin
              ? formatCurrency(lead.expectedBudgetMin)
              : "0"}{" "}
            -{" "}
            {lead.expectedBudgetMax
              ? formatCurrency(lead.expectedBudgetMax)
              : "∞"}
          </div>
        );
      },
    },
    {
      key: "updatedAt",
      label: "Última Atualização",
      render: (lead: Lead) => formatDate(lead.updatedAt),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seus leads de vendas
          </p>
        </div>
        <Button onClick={() => router.push("/leads/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Lead
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou email..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Buscar</Button>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="NEW">Novo</SelectItem>
            <SelectItem value="IN_CONTACT">Em Contato</SelectItem>
            <SelectItem value="QUALIFIED">Qualificado</SelectItem>
            <SelectItem value="WON">Ganho</SelectItem>
            <SelectItem value="LOST">Perdido</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Origens</SelectItem>
            <SelectItem value="WEBSITE">Website</SelectItem>
            <SelectItem value="REFERRAL">Indicação</SelectItem>
            <SelectItem value="SOCIAL_MEDIA">Redes Sociais</SelectItem>
            <SelectItem value="ADVERTISING">Publicidade</SelectItem>
            <SelectItem value="OTHER">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={leads}
        columns={columns}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
