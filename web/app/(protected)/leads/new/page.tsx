"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { formatPhone } from "@/lib/format-utils";

export default function NewLeadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "WEBSITE",
    status: "NEW",
    interestType: "BUY",
    preferredRegions: "",
    expectedBudgetMin: "",
    expectedBudgetMax: "",
    assignedToId: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate budget
    const budgetMin = formData.expectedBudgetMin
      ? Number.parseFloat(formData.expectedBudgetMin)
      : undefined;
    const budgetMax = formData.expectedBudgetMax
      ? Number.parseFloat(formData.expectedBudgetMax)
      : undefined;

    if (budgetMin && budgetMax && budgetMax < budgetMin) {
      toast({
        title: "Invalid Budget",
        description: "Maximum budget must be greater than minimum budget",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.request("/leads", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          expectedBudgetMin: budgetMin,
          expectedBudgetMax: budgetMax,
          preferredRegions: formData.preferredRegions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      toast({
        title: "Lead Created",
        description: "The lead has been successfully created",
      });
      router.push("/leads");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create lead",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Lead</h1>
          <p className="text-muted-foreground">Add a new lead to your CRM</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: formatPhone(e.target.value),
                    })
                  }
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">
                  Source <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) =>
                    setFormData({ ...formData, source: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEBSITE">Website</SelectItem>
                    <SelectItem value="REFERRAL">Referral</SelectItem>
                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                    <SelectItem value="ADVERTISING">Advertising</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="IN_CONTACT">In Contact</SelectItem>
                    <SelectItem value="QUALIFIED">Qualified</SelectItem>
                    <SelectItem value="WON">Won</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest_property_type">
                  Property Type Interest
                </Label>
                <Select
                  value={formData.interestType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, interestType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RENT">Rent</SelectItem>
                    <SelectItem value="BUY">Buy</SelectItem>
                    <SelectItem value="SELL">Sell</SelectItem>
                    <SelectItem value="PROPERTY_MANAGEMENT">
                      Property Management
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="preferredRegions">
                  Interest Regions (comma separated)
                </Label>
                <Input
                  id="preferredRegions"
                  value={formData.preferredRegions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredRegions: e.target.value,
                    })
                  }
                  placeholder="e.g., São Paulo - Centro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedBudgetMin">Minimum Budget</Label>
                <Input
                  id="expectedBudgetMin"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.expectedBudgetMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedBudgetMin: e.target.value,
                    })
                  }
                  placeholder="200000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedBudgetMax">Maximum Budget</Label>
                <Input
                  id="expectedBudgetMax"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.expectedBudgetMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedBudgetMax: e.target.value,
                    })
                  }
                  placeholder="500000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                placeholder="Additional notes about this lead..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Lead"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
