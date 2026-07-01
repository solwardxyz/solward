export type Category = "Engineering" | "Content" | "Design" | "Community" | "Capital";

export const CATEGORIES: Category[] = [
  "Engineering",
  "Content",
  "Design",
  "Community",
  "Capital",
];

export type BountyStatus = "open" | "in_review" | "settled" | "cancelled";
export type ApplicationStatus = "applied" | "submitted" | "verifying" | "settled" | "rejected";

export interface Bounty {
  id: string;
  project: string;
  title: string;
  description: string;
  category: Category;
  amount: number;
  currency: string;
  rep_req: number;
  rep_reward: number;
  creator_wallet: string;
  status: BountyStatus;
  created_at: string;
}

export interface Application {
  id: string;
  bounty_id: string;
  applicant_wallet: string;
  status: ApplicationStatus;
  github_pr: string | null;
  created_at: string;
}
