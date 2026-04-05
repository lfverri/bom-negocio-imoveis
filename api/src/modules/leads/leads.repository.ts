import { Injectable } from "@nestjs/common";
import { LeadInterestType, LeadSource } from "@prisma/client";
import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";

export type Lead = { id: string; name?: string; email?: string };

@Injectable()
export class LeadsRepository extends BaseRepository<Record<string, unknown>> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.lead as any);
  }

  async create(data: Omit<Lead, "id">) {
    return this.prisma.lead.create({
      data: {
        name: data.name || "Lead sem nome",
        email: data.email || "lead@placeholder.local",
        phone: "0000000000",
        source: LeadSource.OTHER,
        interestType: LeadInterestType.RENT,
        preferredRegions: [],
      },
    });
  }
}
