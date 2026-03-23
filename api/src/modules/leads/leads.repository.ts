import { Injectable } from "@nestjs/common";

export type Lead = { id: string; name?: string; email?: string };

@Injectable()
export class LeadsRepository {
  private readonly leads: Lead[] = [];

  findMany(): Lead[] {
    return this.leads;
  }

  create(data: Omit<Lead, "id">): Lead {
    const created: Lead = { id: String(Date.now()), ...data };
    this.leads.push(created);
    return created;
  }
}
