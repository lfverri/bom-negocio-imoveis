import { LeadsRepository } from "./leads.repository";
export declare class LeadsService {
    private readonly repo;
    constructor(repo: LeadsRepository);
    list(): Promise<Record<string, unknown>[]>;
    create(input: {
        name?: string;
        email?: string;
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
        expectedBudgetMin: import("@prisma/client/runtime/library").Decimal | null;
        expectedBudgetMax: import("@prisma/client/runtime/library").Decimal | null;
        preferredRegions: string[];
        assignedToId: string | null;
    }>;
}
