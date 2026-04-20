export const APP_NAME = "Epic AI Safety Fails";

export const TIME_WASTED_BUCKETS = [
  "under_15m",
  "30_60m",
  "1_4h",
  "1_day",
  "multiple_days",
] as const;

export type TimeWastedBucket = (typeof TIME_WASTED_BUCKETS)[number];

export const TIME_WASTED_LABELS: Record<TimeWastedBucket, string> = {
  under_15m: "Under 15 min",
  "30_60m": "30-60 min",
  "1_4h": "1-4 hours",
  "1_day": "1 day",
  multiple_days: "Multiple days",
};

export const MODERATION_STATUSES = ["visible", "hidden", "flagged"] as const;

export type ModerationStatus = (typeof MODERATION_STATUSES)[number];

export const LEADERBOARD_SCOPES = ["weekly", "monthly", "allTime"] as const;

export type LeaderboardScope = (typeof LEADERBOARD_SCOPES)[number];

export interface Contributor {
  id: string;
  username: string;
  fullName: string;
  titleAffiliation: string;
  bio: string;
  xUrl?: string;
  promoUrl?: string;
  donationUrl?: string;
  logCounts: Record<LeaderboardScope, number>;
}

export interface FrustrationLog {
  id: string;
  title: string;
  authorId: string;
  modelName: string;
  taskAttempted: string;
  description: string;
  tags: string[];
  timeWasted: TimeWastedBucket;
  score: number;
  commentCount: number;
  createdAt: string;
  status: ModerationStatus;
}

export interface LogComment {
  id: string;
  logId: string;
  authorId: string;
  parentId?: string;
  content: string;
  score: number;
  status: ModerationStatus;
  createdAt: string;
}

export interface LogFilters {
  query?: string;
  model?: string;
  tag?: string;
  timeWasted?: TimeWastedBucket;
}
