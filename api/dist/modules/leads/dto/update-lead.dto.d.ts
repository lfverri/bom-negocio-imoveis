import { type LeadInterestTypeValue, type LeadSourceValue, type LeadStatusValue } from "./lead.constants";
export declare class UpdateLeadDto {
    name?: string;
    email?: string;
    phone?: string;
    cpfCnpj?: string;
    source?: LeadSourceValue;
    interestType?: LeadInterestTypeValue;
    status?: LeadStatusValue;
    notes?: string;
    assignedToId?: string | null;
    expectedBudgetMin?: number;
    expectedBudgetMax?: number;
    preferredRegions?: string[];
}
