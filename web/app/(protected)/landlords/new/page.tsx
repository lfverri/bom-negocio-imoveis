"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { formatCPF, formatCNPJ, formatPhone, formatCEP, validateCPF, validateCNPJ } from "@/lib/format-utils"

export default function NewLandlordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [personType, setPersonType] = useState<"INDIVIDUAL" | "COMPANY">("INDIVIDUAL")
  const [formData, setFormData] = useState({
    legal_name: "",
    cpf: "",
    cnpj: "",
    rg_ie: "",
    phone: "",
    email: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    postal_code: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate document
    if (personType === "INDIVIDUAL") {
      const cleanCPF = formData.cpf.replace(/\D/g, "")
      if (!validateCPF(cleanCPF)) {
        toast({
          title: "Invalid CPF",
          description: "Please enter a valid CPF",
          variant: "destructive",
        })
        return
      }
    } else {
      const cleanCNPJ = formData.cnpj.replace(/\D/g, "")
      if (!validateCNPJ(cleanCNPJ)) {
        toast({
          title: "Invalid CNPJ",
          description: "Please enter a valid CNPJ",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)
    try {
      await apiClient.request("/landlords", {
        method: "POST",
        body: JSON.stringify({
          person_type: personType,
          legal_name: formData.legal_name,
          cpf: personType === "INDIVIDUAL" ? formData.cpf.replace(/\D/g, "") : undefined,
          cnpj: personType === "COMPANY" ? formData.cnpj.replace(/\D/g, "") : undefined,
          rg_ie: formData.rg_ie,
          phone: formData.phone,
          email: formData.email,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code.replace(/\D/g, ""),
        }),
      })

      toast({
        title: "Landlord Created",
        description: "The landlord has been successfully created",
      })
      router.push("/landlords")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create landlord",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Landlord</h1>
          <p className="text-muted-foreground">Add a new property owner</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Person Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={personType} onValueChange={(value: any) => setPersonType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INDIVIDUAL" id="individual" />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COMPANY" id="company" />
                <Label htmlFor="company">Company</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="legal_name">
                  {personType === "INDIVIDUAL" ? "Full Name" : "Company Name"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="legal_name"
                  value={formData.legal_name}
                  onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                  required
                />
              </div>

              {personType === "INDIVIDUAL" ? (
                <div className="space-y-2">
                  <Label htmlFor="cpf">
                    CPF <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="cnpj">
                    CNPJ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="rg_ie">{personType === "INDIVIDUAL" ? "RG" : "IE"}</Label>
                <Input
                  id="rg_ie"
                  value={formData.rg_ie}
                  onChange={(e) => setFormData({ ...formData, rg_ie: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complement</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: formatCEP(e.target.value) })}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  maxLength={2}
                  placeholder="SP"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Landlord"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
