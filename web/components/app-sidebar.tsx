"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Building2,
  Home,
  FileText,
  DollarSign,
  Shield,
  ClipboardCheck,
  FolderOpen,
  UserCircle,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Inquilinos", href: "/tenants", icon: UserCircle },
  { name: "Proprietários", href: "/landlords", icon: Building2 },
  { name: "Propriedades", href: "/properties", icon: Home },
  { name: "Contratos", href: "/leases", icon: FileText },
  { name: "Pagamentos", href: "/payments", icon: DollarSign },
  { name: "Seguros", href: "/insurance", icon: Shield },
  { name: "Vistorias", href: "/inspections", icon: ClipboardCheck },
  { name: "Documentos", href: "/documents", icon: FolderOpen },
  { name: "Configurações", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="w-8 h-8 rounded-md bg-sidebar-primary flex items-center justify-center">
          <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">Imobiliária CRM</span>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
