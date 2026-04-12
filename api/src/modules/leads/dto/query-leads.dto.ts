import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadSourceValue,
  type LeadStatusValue,
} from "./lead.constants";

export class QueryLeadsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(LEAD_STATUSES)
  status?: LeadStatusValue;

  @IsOptional()
  @IsIn(LEAD_SOURCES)
  source?: LeadSourceValue;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
