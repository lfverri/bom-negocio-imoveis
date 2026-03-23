import { Badge } from "@/components/ui/badge"
import type { LeadStatus } from "@/lib/types"

const statusConfig: Record<
  LeadStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  NEW: { label: "Novo", variant: "default" },
  IN_CONTACT: { label: "Em Contato", variant: "secondary" },
  QUALIFIED: { label: "Qualificado", variant: "outline" },
  WON: { label: "Ganho", variant: "default" },
  LOST: { label: "Perdido", variant: "destructive" },
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
