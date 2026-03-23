import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, FileText, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    { name: "Leads Ativos", value: "47", change: "+12%", icon: Users, color: "text-chart-1" },
    { name: "Propriedades Disponíveis", value: "23", change: "-3", icon: Building2, color: "text-chart-2" },
    { name: "Contratos Ativos", value: "156", change: "+8", icon: FileText, color: "text-chart-3" },
    { name: "Pagamentos Atrasados", value: "12", change: "", icon: AlertCircle, color: "text-destructive" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
        <p className="text-muted-foreground">Visão geral das suas operações imobiliárias</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && <p className="text-xs text-muted-foreground mt-1">{stat.change} do mês passado</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Nenhum lead recente para exibir</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Nenhum pagamento próximo para exibir</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contratos Vencendo em Breve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Nenhum contrato vencendo nos próximos 30 dias</div>
        </CardContent>
      </Card>
    </div>
  )
}
