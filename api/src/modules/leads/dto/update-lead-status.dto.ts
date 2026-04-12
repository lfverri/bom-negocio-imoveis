import { IsIn, IsOptional, IsString } from "class-validator";
import { LEAD_STATUSES, type LeadStatusValue } from "./lead.constants";

export class UpdateLeadStatusDto {
  @IsIn(LEAD_STATUSES)
  status!: LeadStatusValue;

  @IsOptional()
  @IsString()
  reason?: string;
}
