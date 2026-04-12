-- Align LeadStatus enum with CRM flow used by frontend.
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'IN_CONTACT', 'QUALIFIED', 'WON', 'LOST');

ALTER TABLE "leads"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "LeadStatus"
USING (
  CASE
    WHEN "status"::text = 'CONTACTED' THEN 'IN_CONTACT'
    WHEN "status"::text = 'PROPOSAL' THEN 'QUALIFIED'
    WHEN "status"::text = 'NEGOTIATION' THEN 'QUALIFIED'
    ELSE "status"::text
  END
)::"LeadStatus";

ALTER TABLE "leads"
ALTER COLUMN "status" SET DEFAULT 'NEW';

ALTER TABLE "lead_status_history"
ALTER COLUMN "previous_status" TYPE "LeadStatus"
USING (
  CASE
    WHEN "previous_status"::text = 'CONTACTED' THEN 'IN_CONTACT'
    WHEN "previous_status"::text = 'PROPOSAL' THEN 'QUALIFIED'
    WHEN "previous_status"::text = 'NEGOTIATION' THEN 'QUALIFIED'
    ELSE "previous_status"::text
  END
)::"LeadStatus";

ALTER TABLE "lead_status_history"
ALTER COLUMN "new_status" TYPE "LeadStatus"
USING (
  CASE
    WHEN "new_status"::text = 'CONTACTED' THEN 'IN_CONTACT'
    WHEN "new_status"::text = 'PROPOSAL' THEN 'QUALIFIED'
    WHEN "new_status"::text = 'NEGOTIATION' THEN 'QUALIFIED'
    ELSE "new_status"::text
  END
)::"LeadStatus";

DROP TYPE "LeadStatus_old";

-- Align LeadSource enum with CRM source options used by frontend.
ALTER TYPE "LeadSource" RENAME TO "LeadSource_old";
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'ADVERTISING', 'OTHER');

ALTER TABLE "leads"
ALTER COLUMN "source" TYPE "LeadSource"
USING (
  CASE
    WHEN "source"::text = 'PHONE' THEN 'ADVERTISING'
    WHEN "source"::text = 'WALK_IN' THEN 'ADVERTISING'
    ELSE "source"::text
  END
)::"LeadSource";

DROP TYPE "LeadSource_old";

-- Add indexes for lead listing/filtering and timeline queries.
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads"("status");
CREATE INDEX IF NOT EXISTS "leads_source_idx" ON "leads"("source");
CREATE INDEX IF NOT EXISTS "leads_assigned_to_id_idx" ON "leads"("assigned_to_id");
CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads"("created_at");
CREATE INDEX IF NOT EXISTS "lead_activities_lead_id_created_at_idx" ON "lead_activities"("lead_id", "created_at");
CREATE INDEX IF NOT EXISTS "lead_activities_user_id_idx" ON "lead_activities"("user_id");
CREATE INDEX IF NOT EXISTS "lead_status_history_lead_id_created_at_idx" ON "lead_status_history"("lead_id", "created_at");
