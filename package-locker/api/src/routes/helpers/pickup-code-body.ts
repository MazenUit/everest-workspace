// Parse the pickup code from the request body
export function parsePickupCode(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const code = value.trim();
    return code.length > 0 ? code : null;
  }