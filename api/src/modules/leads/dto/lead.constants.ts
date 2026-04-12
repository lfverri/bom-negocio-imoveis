export const LEAD_SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "SOCIAL_MEDIA",
  "ADVERTISING",
  "OTHER",
] as const;

export const LEAD_STATUSES = [
  "NEW",
  "IN_CONTACT",
  "QUALIFIED",
  "WON",
  "LOST",
] as const;

export const LEAD_INTEREST_TYPES = [
  "RENT",
  "BUY",
  "SELL",
  "PROPERTY_MANAGEMENT",
] as const;

export const LEAD_ACTIVITY_TYPES = [
  "CALL",
  "EMAIL",
  "MEETING",
  "NOTE",
  "PROPERTY_VISIT",
  "STATUS_CHANGE",
] as const;

export type LeadSourceValue = (typeof LEAD_SOURCES)[number];
export type LeadStatusValue = (typeof LEAD_STATUSES)[number];
export type LeadInterestTypeValue = (typeof LEAD_INTEREST_TYPES)[number];
export type LeadActivityTypeValue = (typeof LEAD_ACTIVITY_TYPES)[number];
