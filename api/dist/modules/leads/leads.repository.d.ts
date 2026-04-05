import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
export type Lead = {
    id: string;
    name?: string;
    email?: string;
};
export declare class LeadsRepository extends BaseRepository<Record<string, unknown>> {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Omit<Lead, "id">): Promise<{
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
        expectedBudgetMin: import("@prisma/client/runtime/library").Decimal | null;
        expectedBudgetMax: import("@prisma/client/runtime/library").Decimal | null;
        preferredRegions: string[];
        assignedToId: string | null;
    }>;
}
