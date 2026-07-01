export function shortWallet(addr: string | null | undefined): string {
  if (!addr) return "";
  return addr.length > 8 ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : addr;
}

export function repTier(rep: number): string {
  if (rep >= 200) return "Architect";
  if (rep >= 120) return "Senior";
  if (rep >= 50) return "Builder";
  return "Newcomer";
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const secs = Math.max(1, Math.floor((Date.now() - then) / 1000));
  const units: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.35, "w"],
    [12, "mo"],
  ];
  let value = secs;
  let unit = "s";
  for (const [factor, label] of units) {
    if (value < factor) break;
    value = value / factor;
    unit = label;
  }
  return `${Math.floor(value)}${unit} ago`;
}
