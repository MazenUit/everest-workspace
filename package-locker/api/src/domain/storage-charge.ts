/*
- count billable days, then add X, 2X, or 3X for each day depending on whether
it’s in the first five days, second five, or after that.

- bill per 24-hour day from store to retrieve. Days 1–5 are X per day, 6–10 are double, 
11+ are triple. The loop applies the right rate for each day so it matches the tier spec
*/
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
    // Turn two timestamps into “how many days” (24h units, usually ceil so >0–24h counts as 1 day).
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

  /*
  Tiny example (X = 1)
    2 days in locker:
    Day 1 → +1
    Day 2 → +1
    Total = 2

    7 days:
    Days 1–5 → 5 × 1 = 5
    Days 6–7 → 2 × 2 = 4
    Total = 9
  */