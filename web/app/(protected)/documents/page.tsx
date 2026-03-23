"use client"

import { useState } from "react"
import { Search, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function DocumentsPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage all system documents</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button>Search</Button>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="font-medium">No documents found</h3>
              <p className="text-sm text-muted-foreground">Upload your first document to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
