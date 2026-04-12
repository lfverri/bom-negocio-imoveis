import { type LeadActivityTypeValue } from "./lead.constants";
export declare class CreateLeadActivityDto {
    type: LeadActivityTypeValue;
    description: string;
    scheduledAt?: Date;
    completedAt?: Date;
}
