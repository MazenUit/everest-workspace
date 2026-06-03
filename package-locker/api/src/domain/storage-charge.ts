const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysBetween(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  if (diff < 0) return 0;
  return Math.ceil(diff / MS_PER_DAY);
}

/** Tier: days 1–5 → X/day, 6–10 → 2X, 11+ → 3X */
export function calculateStorageCharge(
  storedAt: Date,
  retrievedAt: Date,
  x: number = 1
): number {
  const days = daysBetween(storedAt, retrievedAt);
  if (days === 0) return 0;

  let total = 0;
  for (let d = 1; d <= days; d++) {
    if (d <= 5) total += x;
    else if (d <= 10) total += 2 * x;
    else total += 3 * x;
  }
  return total;
}