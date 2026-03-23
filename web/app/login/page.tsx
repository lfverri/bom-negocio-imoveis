"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Building2 } from "lucide-react"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier || !password) {
      toast({
        title: "Credenciais Inválidas",
        description: "Por favor, preencha o identificador e a senha",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await login(identifier, password)
      toast({
        title: "Bem-vindo de volta!",
        description: "Você entrou com sucesso",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Falha no Login",
        description: error instanceof Error ? error.message : "Credenciais inválidas ou usuário inativo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Gestão Imobiliária</CardTitle>
            <CardDescription>Entre para acessar sua conta</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">CPF ou Email</Label>
              <Input
                id="identifier"
                placeholder="000.000.000-00 ou email@exemplo.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Modo demonstração: Digite qualquer credencial para acessar
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
