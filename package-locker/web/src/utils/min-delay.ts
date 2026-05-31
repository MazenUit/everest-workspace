// Avoid spinner flash when the API responds in a few milliseconds.
export const MIN_SPINNER_MS = 400;

export async function ensureMinDelay(
  startedAt: number,
  minMs: number = MIN_SPINNER_MS
): Promise<void> {
  const wait = minMs - (Date.now() - startedAt);
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}
