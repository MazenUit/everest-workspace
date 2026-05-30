import { Request } from 'express';
import { config } from '../../config';

/**
 * Dev only: fake "now" at retrieve to  storage fees.
 * Production always returns undefined (real time in service).
 * use X-Simulated-Now: 2026-01-08T10:00:00.000Z for simulated retrieve time
 */
export function getDevRetrieveTime(req: Request): Date | undefined {
  if (!config.isDev) {
    return undefined;
  }

  const header = req.headers['x-simulated-now'];
  if (typeof header === 'string') {
    const fromHeader = new Date(header);
    if (!Number.isNaN(fromHeader.getTime())) {
      return fromHeader;
    }
  }

  const body = req.body?.simulatedRetrieveAt;
  if (typeof body === 'string') {
    const fromBody = new Date(body);
    if (!Number.isNaN(fromBody.getTime())) {
      return fromBody;
    }
  }

  return undefined;
}