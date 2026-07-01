import { supabase } from "./supabase";
import type { Bounty, Application, Category } from "./types";

export async function listBounties(): Promise<Bounty[]> {
  const { data, error } = await supabase
    .from("bounties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Bounty[];
}

export interface NewBounty {
  project: string;
  title: string;
  description: string;
  category: Category;
  amount: number;
  rep_req: number;
  rep_reward: number;
  creator_wallet: string;
}

export async function createBounty(b: NewBounty): Promise<Bounty> {
  const { data, error } = await supabase
    .from("bounties")
    .insert({ ...b, currency: "USDC", status: "open" })
    .select()
    .single();
  if (error) throw error;
  return data as Bounty;
}

export async function applyToBounty(
  bountyId: string,
  wallet: string
): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .insert({ bounty_id: bountyId, applicant_wallet: wallet, status: "applied" })
    .select()
    .single();
  if (error) throw error;
  return data as Application;
}

export async function myApplications(wallet: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("applicant_wallet", wallet);
  if (error) throw error;
  return (data ?? []) as Application[];
}
