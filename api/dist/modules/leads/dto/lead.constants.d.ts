export declare const LEAD_SOURCES: readonly ["WEBSITE", "REFERRAL", "SOCIAL_MEDIA", "ADVERTISING", "OTHER"];
export declare const LEAD_STATUSES: readonly ["NEW", "IN_CONTACT", "QUALIFIED", "WON", "LOST"];
export declare const LEAD_INTEREST_TYPES: readonly ["RENT", "BUY", "SELL", "PROPERTY_MANAGEMENT"];
export declare const LEAD_ACTIVITY_TYPES: readonly ["CALL", "EMAIL", "MEETING", "NOTE", "PROPERTY_VISIT", "STATUS_CHANGE"];
export type LeadSourceValue = (typeof LEAD_SOURCES)[number];
export type LeadStatusValue = (typeof LEAD_STATUSES)[number];
export type LeadInterestTypeValue = (typeof LEAD_INTEREST_TYPES)[number];
export type LeadActivityTypeValue = (typeof LEAD_ACTIVITY_TYPES)[number];
