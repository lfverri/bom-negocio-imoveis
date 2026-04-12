import { type LeadSourceValue, type LeadStatusValue } from "./lead.constants";
export declare class QueryLeadsDto {
    name?: string;
    status?: LeadStatusValue;
    source?: LeadSourceValue;
    page?: number;
    pageSize?: number;
}
