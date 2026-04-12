import {
  IsArray,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import {
  LEAD_INTEREST_TYPES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadInterestTypeValue,
  type LeadSourceValue,
  type LeadStatusValue,
} from "./lead.constants";

export class CreateLeadDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cpfCnpj?: string;

  @IsOptional()
  @IsIn(LEAD_SOURCES)
  source?: LeadSourceValue;

  @IsOptional()
  @IsIn(LEAD_INTEREST_TYPES)
  interestType?: LeadInterestTypeValue;

  @IsOptional()
  @IsIn(LEAD_STATUSES)
  status?: LeadStatusValue;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedBudgetMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedBudgetMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredRegions?: string[];
}
