-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'AGENT', 'VIEWER');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'PHONE', 'WALK_IN', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadInterestType" AS ENUM ('RENT', 'BUY', 'SELL', 'PROPERTY_MANAGEMENT');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "LeadActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'NOTE', 'PROPERTY_VISIT', 'STATUS_CHANGE');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "PersonStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('CHECKING', 'SAVINGS');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND', 'WAREHOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RENTED', 'UNDER_MAINTENANCE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "LeaseStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DepositType" AS ENUM ('CASH', 'BANK_GUARANTEE', 'INSURANCE', 'GUARANTOR');

-- CreateEnum
CREATE TYPE "ReadjustmentIndex" AS ENUM ('IGPM', 'IPCA', 'INPC', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('RENT', 'CONDOMINIUM', 'IPTU', 'WATER', 'ELECTRICITY', 'GAS', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'BANK_TRANSFER', 'BOLETO', 'CASH', 'CHECK');

-- CreateEnum
CREATE TYPE "LandlordPaymentStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('FIRE', 'RENTAL_GUARANTEE', 'CONTENT', 'COMPREHENSIVE');

-- CreateEnum
CREATE TYPE "InsuranceStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('ENTRY', 'EXIT', 'PERIODIC', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "DocumentEntityType" AS ENUM ('LEAD', 'TENANT', 'LANDLORD', 'PROPERTY', 'LEASE', 'INSURANCE', 'INSPECTION');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CONTRACT', 'ID_DOCUMENT', 'PROOF_OF_INCOME', 'PROOF_OF_ADDRESS', 'PHOTO', 'REPORT', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'AGENT',
    "avatar_url" TEXT,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cpf_cnpj" TEXT,
    "source" "LeadSource" NOT NULL,
    "interest_type" "LeadInterestType" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "assigned_to_id" TEXT,
    "expected_budget_min" DECIMAL(12,2),
    "expected_budget_max" DECIMAL(12,2),
    "preferred_regions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "LeadActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_status_history" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "previous_status" "LeadStatus" NOT NULL,
    "new_status" "LeadStatus" NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "person_type" "PersonType" NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT,
    "cnpj" TEXT,
    "rg" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "secondary_phone" TEXT,
    "birth_date" DATE,
    "profession" TEXT,
    "monthly_income" DECIMAL(12,2),
    "employer_name" TEXT,
    "employer_phone" TEXT,
    "address_street" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_complement" TEXT,
    "address_neighborhood" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" CHAR(2) NOT NULL,
    "address_postal_code" TEXT NOT NULL,
    "status" "PersonStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_emergency_contacts" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "tenant_emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landlords" (
    "id" TEXT NOT NULL,
    "person_type" "PersonType" NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT,
    "cnpj" TEXT,
    "rg" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "secondary_phone" TEXT,
    "bank_name" TEXT,
    "bank_agency" TEXT,
    "bank_account" TEXT,
    "bank_account_type" "BankAccountType",
    "pix_key" TEXT,
    "address_street" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_complement" TEXT,
    "address_neighborhood" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" CHAR(2) NOT NULL,
    "address_postal_code" TEXT NOT NULL,
    "commission_percentage" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "status" "PersonStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landlords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "landlord_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "property_type" "PropertyType" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "address_street" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_complement" TEXT,
    "address_neighborhood" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" CHAR(2) NOT NULL,
    "address_postal_code" TEXT NOT NULL,
    "total_area" DECIMAL(10,2) NOT NULL,
    "built_area" DECIMAL(10,2),
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "parking_spaces" INTEGER NOT NULL DEFAULT 0,
    "floor" INTEGER,
    "has_elevator" BOOLEAN NOT NULL DEFAULT false,
    "is_furnished" BOOLEAN NOT NULL DEFAULT false,
    "allows_pets" BOOLEAN NOT NULL DEFAULT false,
    "rent_value" DECIMAL(12,2) NOT NULL,
    "condominium_fee" DECIMAL(12,2),
    "iptu_value" DECIMAL(12,2),
    "description" TEXT,
    "features" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leases" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "landlord_id" TEXT NOT NULL,
    "status" "LeaseStatus" NOT NULL DEFAULT 'DRAFT',
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "rent_value" DECIMAL(12,2) NOT NULL,
    "condominium_fee" DECIMAL(12,2),
    "iptu_value" DECIMAL(12,2),
    "payment_due_day" INTEGER NOT NULL,
    "deposit_amount" DECIMAL(12,2),
    "deposit_type" "DepositType",
    "readjustment_index" "ReadjustmentIndex" NOT NULL,
    "readjustment_period_months" INTEGER NOT NULL DEFAULT 12,
    "late_fee_percentage" DECIMAL(5,2) NOT NULL DEFAULT 2,
    "late_interest_percentage" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "grace_period_days" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "cancellation_reason" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lease_guarantors" (
    "id" TEXT NOT NULL,
    "lease_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profession" TEXT,
    "monthly_income" DECIMAL(12,2),
    "address_street" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_complement" TEXT,
    "address_neighborhood" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" CHAR(2) NOT NULL,
    "address_postal_code" TEXT NOT NULL,
    "spouse_name" TEXT,
    "spouse_cpf" TEXT,

    CONSTRAINT "lease_guarantors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "lease_id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "reference_month" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "base_amount" DECIMAL(12,2) NOT NULL,
    "late_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "interest" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "paid_amount" DECIMAL(12,2),
    "payment_method" "PaymentMethod",
    "boleto_url" TEXT,
    "boleto_code" TEXT,
    "boleto_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landlord_payments" (
    "id" TEXT NOT NULL,
    "landlord_id" TEXT NOT NULL,
    "lease_id" TEXT NOT NULL,
    "reference_month" DATE NOT NULL,
    "gross_amount" DECIMAL(12,2) NOT NULL,
    "commission_amount" DECIMAL(12,2) NOT NULL,
    "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_amount" DECIMAL(12,2) NOT NULL,
    "status" "LandlordPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landlord_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurances" (
    "id" TEXT NOT NULL,
    "lease_id" TEXT,
    "property_id" TEXT NOT NULL,
    "type" "InsuranceType" NOT NULL,
    "insurer_name" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "coverage_amount" DECIMAL(14,2) NOT NULL,
    "premium_amount" DECIMAL(12,2) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "InsuranceStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "lease_id" TEXT,
    "type" "InspectionType" NOT NULL,
    "status" "InspectionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduled_date" DATE NOT NULL,
    "completed_date" DATE,
    "inspector_name" TEXT,
    "general_condition" "Condition",
    "observations" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_items" (
    "id" TEXT NOT NULL,
    "inspection_id" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "condition" "ItemCondition" NOT NULL,
    "observations" TEXT,
    "photos" TEXT[],

    CONSTRAINT "inspection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "entity_type" "DocumentEntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_cpf_key" ON "tenants"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_cnpj_key" ON "tenants"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "landlords_cpf_key" ON "landlords"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "landlords_cnpj_key" ON "landlords"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "properties_code_key" ON "properties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "leases_code_key" ON "leases"("code");

-- CreateIndex
CREATE INDEX "documents_entity_type_entity_id_idx" ON "documents"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_emergency_contacts" ADD CONSTRAINT "tenant_emergency_contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "landlords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "landlords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lease_guarantors" ADD CONSTRAINT "lease_guarantors_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landlord_payments" ADD CONSTRAINT "landlord_payments_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "landlords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landlord_payments" ADD CONSTRAINT "landlord_payments_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
