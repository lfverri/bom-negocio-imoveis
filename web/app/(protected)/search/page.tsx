"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Users, Building2, Home, FileText, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

type SearchResult = {
  type: "lead" | "tenant" | "landlord" | "property" | "lease" | "payment"
  id: string
  title: string
  subtitle?: string
  metadata?: string
}

type GroupedResults = {
  leads: SearchResult[]
  tenants: SearchResult[]
  landlords: SearchResult[]
  properties: SearchResult[]
  leases: SearchResult[]
  payments: SearchResult[]
}

const typeConfig = {
  lead: { icon: Users, label: "Leads", path: "/leads", color: "text-chart-1" },
  tenant: { icon: Users, label: "Tenants", path: "/tenants", color: "text-chart-2" },
  landlord: { icon: Building2, label: "Landlords", path: "/landlords", color: "text-chart-3" },
  property: { icon: Home, label: "Properties", path: "/properties", color: "text-chart-4" },
  lease: { icon: FileText, label: "Leases", path: "/leases", color: "text-chart-5" },
  payment: { icon: DollarSign, label: "Payments", path: "/payments", color: "text-accent" },
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<GroupedResults>({
    leads: [],
    tenants: [],
    landlords: [],
    properties: [],
    leases: [],
    payments: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await apiClient.request<GroupedResults>(`/search?q=${encodeURIComponent(searchQuery)}`)
      setResults(response)
    } catch (error) {
      console.error("[v0] Search failed:", error)
      // Mock data for demo
      setResults({
        leads: [
          {
            type: "lead",
            id: "1",
            title: "João Silva",
            subtitle: "joao@example.com",
            metadata: "NEW - Interested in apartments",
          },
        ],
        tenants: [
          {
            type: "tenant",
            id: "1",
            title: "Carlos Mendes",
            subtitle: "carlos@example.com",
            metadata: "CPF: 123.456.789-01",
          },
        ],
        landlords: [
          {
            type: "landlord",
            id: "1",
            title: "Maria Silva Santos",
            subtitle: "maria.santos@example.com",
            metadata: "Individual",
          },
        ],
        properties: [
          {
            type: "property",
            id: "1",
            title: "Av. Paulista, 1000 - Apt 501",
            subtitle: "São Paulo, SP",
            metadata: "Available - Apartment",
          },
        ],
        leases: [
          {
            type: "lease",
            id: "1",
            title: "Av. Paulista, 1000 - Carlos Mendes",
            subtitle: "Active lease",
            metadata: "R$ 2,500.00/month",
          },
        ],
        payments: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      performSearch(query)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    const config = typeConfig[result.type]
    router.push(`${config.path}/${result.id}`)
  }

  const totalResults =
    results.leads.length +
    results.tenants.length +
    results.landlords.length +
    results.properties.length +
    results.leases.length +
    results.payments.length

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
        <p className="text-muted-foreground">Search across all modules</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for leads, tenants, properties, leases..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {initialQuery && !loading && (
        <div className="text-sm text-muted-foreground">
          {totalResults} result{totalResults !== 1 ? "s" : ""} found for "{initialQuery}"
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Searching...</p>
        </div>
      )}

      {!loading && initialQuery && totalResults === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">No results found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && initialQuery && totalResults > 0 && (
        <div className="space-y-6">
          {Object.entries(results).map(([key, items]) => {
            if (items.length === 0) return null

            const type = key.slice(0, -1) as keyof typeof typeConfig
            const config = typeConfig[type]
            const Icon = config.icon

            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    {config.label}
                    <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && <div className="text-sm text-muted-foreground">{result.subtitle}</div>}
                      {result.metadata && <div className="text-xs text-muted-foreground mt-1">{result.metadata}</div>}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
