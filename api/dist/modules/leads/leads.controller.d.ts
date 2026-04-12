import { CreateLeadActivityDto } from "./dto/create-lead-activity.dto";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";
import { LeadsService } from "./leads.service";
export declare class LeadsController {
    private readonly leads;
    constructor(leads: LeadsService);
    list(query: QueryLeadsDto): Promise<import("./leads.repository").LeadListResponse>;
    getById(id: string): Promise<{
        name: string;
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        interestType: import("@prisma/client").$Enums.LeadInterestType;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        assignedToId: string | null;
        expectedBudgetMin: import("@prisma/client/runtime/library").Decimal | null;
        expectedBudgetMax: import("@prisma/client/runtime/library").Decimal | null;
        preferredRegions: string[];
    }>;
    create(dto: CreateLeadDto): import("@prisma/client").Prisma.Prisma__LeadClient<{
        name: string;
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        interestType: import("@prisma/client").$Enums.LeadInterestType;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        assignedToId: string | null;
        expectedBudgetMin: import("@prisma/client/runtime/library").Decimal | null;
        expectedBudgetMax: import("@prisma/client/runtime/library").Decimal | null;
        preferredRegions: string[];
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateLeadDto, req: {
        user?: {
            sub?: string;
        };
    }): Promise<{
        name: string;
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        interestType: import("@prisma/client").$Enums.LeadInterestType;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        assignedToId: string | null;
        expectedBudgetMin: import("@prisma/client/runtime/library").Decimal | null;
        expectedBudgetMax: import("@prisma/client/runtime/library").Decimal | null;
        preferredRegions: string[];
    }>;
    remove(id: string): Promise<{
        name: string;
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        interestType: import("@prisma/client").$Enums.LeadInterestType;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        assignedToId: string | null;
        expectedBudgetMin: import("@prisma/client/runtime/library").Decimal | null;
        expectedBudgetMax: import("@prisma/client/runtime/library").Decimal | null;
        preferredRegions: string[];
    }>;
    listActivities(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.LeadActivityType;
        description: string;
        scheduledAt: Date | null;
        completedAt: Date | null;
        leadId: string;
        userId: string;
    }[]>;
    createActivity(id: string, req: {
        user?: {
            sub?: string;
        };
    }, dto: CreateLeadActivityDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.LeadActivityType;
        description: string;
        scheduledAt: Date | null;
        completedAt: Date | null;
        leadId: string;
        userId: string;
    }>;
    listStatusHistory(id: string): Promise<{
        id: string;
        createdAt: Date;
        reason: string | null;
        leadId: string;
        userId: string;
        previousStatus: import("@prisma/client").$Enums.LeadStatus;
        newStatus: import("@prisma/client").$Enums.LeadStatus;
    }[]>;
    transitionStatus(id: string, req: {
        user?: {
            sub?: string;
        };
    }, dto: UpdateLeadStatusDto): Promise<{
        name: string;
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cpfCnpj: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        interestType: import("@prisma/client").$Enums.LeadInterestType;
        status: import("@prisma/client").$Enums.LeadStatus;
        notes: string | null;
        assignedToId: string | null;
        expectedBudgetMin: import("@prisma/client/runtime/library").Decimal | null;
        expectedBudgetMax: import("@prisma/client/runtime/library").Decimal | null;
        preferredRegions: string[];
    }>;
}
