"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

type Column<T> = {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export function DataTable<T>({ data, columns, page, pageSize, total, onPageChange, loading }: DataTableProps<T>) {
  const safeData = data || []
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : safeData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            ) : (
              safeData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item) : String((item as any)[column.key] || "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(page - 1) * pageSize + 1} até {Math.min(page * pageSize, total)} de {total} resultados
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
