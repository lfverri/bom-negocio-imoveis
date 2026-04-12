// Type definitions for the application

export type LeadStatus = "NEW" | "IN_CONTACT" | "QUALIFIED" | "WON" | "LOST";
export type LeadSource =
  | "WEBSITE"
  | "REFERRAL"
  | "SOCIAL_MEDIA"
  | "ADVERTISING"
  | "OTHER";
export type ActivityType =
  | "CALL"
  | "WHATSAPP"
  | "EMAIL"
  | "MEETING"
  | "VISIT"
  | "NOTE"
  | "TASK";
export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "COMMERCIAL"
  | "LAND"
  | "OTHER";
export type PropertyStatus =
  | "AVAILABLE"
  | "RENTED"
  | "IN_NEGOTIATION"
  | "INACTIVE";
export type LeaseStatus = "DRAFT" | "ACTIVE" | "ENDED" | "CANCELLED";
export type PersonType = "INDIVIDUAL" | "COMPANY";
export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
export type InsuranceStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
export type InspectionType = "MOVE_IN" | "MOVE_OUT" | "ROUTINE" | "MAINTENANCE";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpfCnpj?: string | null;
  source: LeadSource;
  status: LeadStatus;
  interestType: "RENT" | "BUY" | "SELL" | "PROPERTY_MANAGEMENT";
  notes?: string | null;
  assignedToId?: string | null;
  expectedBudgetMin?: number | null;
  expectedBudgetMax?: number | null;
  preferredRegions: string[];
  createdAt: string;
  updatedAt: string;
};

export type LeadActivity = {
  id: string;
  leadId: string;
  userId: string;
  type:
    | "CALL"
    | "EMAIL"
    | "MEETING"
    | "NOTE"
    | "PROPERTY_VISIT"
    | "STATUS_CHANGE";
  description: string;
  scheduledAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
};

export type LeadStatusHistory = {
  id: string;
  leadId: string;
  userId: string;
  previousStatus: LeadStatus;
  newStatus: LeadStatus;
  reason?: string | null;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type Tenant = {
  id: string;
  full_name: string;
  cpf: string;
  rg?: string;
  date_of_birth?: string;
  marital_status?: string;
  occupation?: string;
  monthly_income?: number;
  phone?: string;
  email?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
};

export type TenantReference = {
  id: string;
  tenant_id: string;
  full_name: string;
  phone: string;
  relationship: string;
  notes?: string;
  created_at: string;
};

export type Landlord = {
  id: string;
  person_type: PersonType;
  legal_name: string;
  cpf?: string;
  cnpj?: string;
  rg_ie?: string;
  phone?: string;
  email?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  landlord_id: string;
  landlord_name?: string;
  property_type: PropertyType;
  status: PropertyStatus;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  registry_number: string;
  registry_office: string;
  iptu_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Lease = {
  id: string;
  property_id: string;
  property_address?: string;
  tenant_id: string;
  tenant_name?: string;
  landlord_id: string;
  landlord_name?: string;
  status: LeaseStatus;
  rent_indexer_id: string;
  rent_indexer_name?: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  due_day: number;
  late_interest_pct_per_month: number;
  late_fee_pct: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type RentIndexer = {
  id: string;
  name: string;
  code: string;
  description?: string;
};

export type Payment = {
  id: string;
  lease_id: string;
  lease_property?: string;
  tenant_name?: string;
  installment_number: number;
  competence: string;
  due_date: string;
  status: PaymentStatus;
  base_amount: number;
  interest_amount?: number;
  penalty_amount?: number;
  correction_amount?: number;
  total_amount: number;
  paid_date?: string;
  paid_amount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type InsuranceType = {
  id: string;
  name: string;
  description?: string;
};

export type InsurancePolicy = {
  id: string;
  lease_id: string;
  lease_property?: string;
  tenant_name?: string;
  insurance_type_id: string;
  insurance_type_name?: string;
  insurer_name: string;
  policy_number: string;
  insured_amount: number;
  start_date: string;
  end_date: string;
  status: InsuranceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Inspection = {
  id: string;
  property_id: string;
  property_address?: string;
  lease_id?: string;
  inspection_type: InspectionType;
  inspection_date: string;
  summary?: string;
  condition_rating?: number;
  performed_by_id?: string;
  performed_by_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};
