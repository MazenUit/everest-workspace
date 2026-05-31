import type { ApiError, Locker, PackageSize } from '../types';

const base = import.meta.env.VITE_API_BASE ?? '/api';

async function parseJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: ApiError }> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  const body = await parseJson<ApiError & T>(res);
  if (!res.ok) {
    return { ok: false, status: res.status, error: { message: body.message, reason: body.reason } };
  }
  return { ok: true, data: body as T };
}

export async function listLockers() {
  return request<{ lockers: Locker[] }>('/lockers');
}

export async function storePackage(packageSize: PackageSize) {
  return request<{ lockerId: string; pickupCode: string; message: string }>(
    '/packages/store',
    { method: 'POST', body: JSON.stringify({ packageSize }) }
  );
}

export async function retrievePackage(
  lockerId: string,
  pickupCode: string,
  simulatedNow?: string
) {
  const headers: Record<string, string> = {};
  if (simulatedNow) {
    headers['X-Simulated-Now'] = simulatedNow;
  }
  return request<{ lockerId: string; storageCharge: number; message: string }>(
    `/lockers/${encodeURIComponent(lockerId)}/retrieve`,
    { method: 'POST', body: JSON.stringify({ pickupCode }), headers }
  );
}
