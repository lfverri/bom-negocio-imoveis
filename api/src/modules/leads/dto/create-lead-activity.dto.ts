import { Type } from "class-transformer";
import { IsDate, IsIn, IsOptional, IsString } from "class-validator";
import {
  LEAD_ACTIVITY_TYPES,
  type LeadActivityTypeValue,
} from "./lead.constants";

export class CreateLeadActivityDto {
  @IsIn(LEAD_ACTIVITY_TYPES)
  type!: LeadActivityTypeValue;

  @IsString()
  description!: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;
}
