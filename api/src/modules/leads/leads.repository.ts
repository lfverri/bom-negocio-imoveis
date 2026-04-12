import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLeadActivityDto } from "./dto/create-lead-activity.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";

export type LeadListResponse = {
  data: unknown[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

@Injectable()
export class LeadsRepository extends BaseRepository<Record<string, unknown>> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.lead as any);
  }

  async list(query: QueryLeadsDto): Promise<LeadListResponse> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.LeadWhereInput = {};
    if (query.name?.trim()) {
      where.name = {
        contains: query.name.trim(),
        mode: "insensitive",
      } as Prisma.StringFilter;
    }
    if (query.status) where.status = query.status as any;
    if (query.source) where.source = query.source as any;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.lead.count({ where }),
      this.prisma.lead.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      data,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  findOneById(id: string) {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  createLead(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email ?? "lead@placeholder.local",
        phone: dto.phone ?? "0000000000",
        cpfCnpj: dto.cpfCnpj,
        source: (dto.source ?? "OTHER") as any,
        interestType: (dto.interestType ?? "RENT") as any,
        status: (dto.status ?? "NEW") as any,
        notes: dto.notes,
        assignedToId: dto.assignedToId,
        expectedBudgetMin: dto.expectedBudgetMin,
        expectedBudgetMax: dto.expectedBudgetMax,
        preferredRegions: dto.preferredRegions ?? [],
      },
    });
  }

  updateLead(id: string, dto: UpdateLeadDto) {
    return this.prisma.lead.update({
      where: { id },
      data: {
        ...dto,
        status: dto.status as any,
        source: dto.source as any,
        interestType: dto.interestType as any,
      },
    });
  }

  deleteLead(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }

  listActivities(leadId: string) {
    return this.prisma.leadActivity.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
  }

  createActivity(leadId: string, userId: string, dto: CreateLeadActivityDto) {
    return this.prisma.leadActivity.create({
      data: {
        leadId,
        userId,
        type: dto.type as any,
        description: dto.description,
        scheduledAt: dto.scheduledAt,
        completedAt: dto.completedAt,
      },
    });
  }

  listStatusHistory(leadId: string) {
    return this.prisma.leadStatusHistory.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
  }

  async transitionStatus(
    leadId: string,
    userId: string,
    dto: UpdateLeadStatusDto,
  ) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return null;

    const [updatedLead] = await this.prisma.$transaction([
      this.prisma.lead.update({
        where: { id: leadId },
        data: { status: dto.status as any },
      }),
      this.prisma.leadStatusHistory.create({
        data: {
          leadId,
          userId,
          previousStatus: lead.status as any,
          newStatus: dto.status as any,
          reason: dto.reason,
        },
      }),
      this.prisma.leadActivity.create({
        data: {
          leadId,
          userId,
          type: "STATUS_CHANGE" as any,
          description: dto.reason ?? `Status changed to ${dto.status}`,
        },
      }),
    ]);

    return updatedLead;
  }
}
