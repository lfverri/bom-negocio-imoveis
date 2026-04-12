"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import type { LeadStatusHistory } from "@/lib/types";
import { formatDate } from "@/lib/format-utils";

export default function LeadHistoryPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [history, setHistory] = useState<LeadStatusHistory[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await apiClient.request<LeadStatusHistory[]>(
          `/leads/${leadId}/status-history`,
        );
        setHistory(data);
      } catch {
        setHistory([]);
      }
    };

    loadHistory();
  }, [leadId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Status History</h2>

      <Card>
        <CardContent className="py-8">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No status changes recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="rounded-md border p-3">
                  <div className="text-sm font-medium">
                    {item.previousStatus} {">"} {item.newStatus}
                  </div>
                  {item.reason && (
                    <div className="text-sm text-muted-foreground">
                      {item.reason}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
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
