"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import type { LeadActivity } from "@/lib/types";
import { formatDate } from "@/lib/format-utils";

export default function LeadActivitiesPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<LeadActivity["type"]>("CALL");

  const loadActivities = async () => {
    try {
      const data = await apiClient.request<LeadActivity[]>(
        `/leads/${leadId}/activities`,
      );
      setActivities(data);
    } catch {
      setActivities([]);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [leadId]);

  const handleCreate = async () => {
    if (!description.trim()) return;

    await apiClient.request(`/leads/${leadId}/activities`, {
      method: "POST",
      body: JSON.stringify({ type, description }),
    });

    setDescription("");
    await loadActivities();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activities</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Activity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Select
            value={type}
            onValueChange={(value) => setType(value as LeadActivity["type"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CALL">Call</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="MEETING">Meeting</SelectItem>
              <SelectItem value="NOTE">Note</SelectItem>
              <SelectItem value="PROPERTY_VISIT">Property Visit</SelectItem>
              <SelectItem value="STATUS_CHANGE">Status Change</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="md:col-span-2"
            placeholder="Activity description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-8">
          {activities.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No activities recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="rounded-md border p-3">
                  <div className="text-sm font-medium">{activity.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.description}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatDate(activity.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
