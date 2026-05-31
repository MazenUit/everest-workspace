import { useState } from 'react';
import { useLockerStore } from '../store/locker-store';
import { Panel } from './Panel';

const label = 'flex flex-col gap-1 text-sm text-zinc-700';
const input =
  'rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500';
const btnPrimary =
  'w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 sm:w-auto';

export function RetrievePackage() {
  const [lockerId, setLockerId] = useState('');
  const [pickupCode, setPickupCode] = useState('');
  const [simulatedNow, setSimulatedNow] = useState('');

  const busy = useLockerStore((s) => s.retrieveBusy);
  const error = useLockerStore((s) => s.retrieveError);
  const lastCharge = useLockerStore((s) => s.lastCharge);
  const retrievePackage = useLockerStore((s) => s.retrievePackage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let simulatedIso: string | undefined;
    if (simulatedNow) {
      const at = new Date(simulatedNow);
      if (!Number.isNaN(at.getTime())) {
        simulatedIso = at.toISOString();
      }
    }
    await retrievePackage(lockerId.trim(), pickupCode.trim(), simulatedIso);
  }

  return (
    <Panel title="Retrieve package (customer)">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className={label}>
          Locker ID
          <input
            className={input}
            value={lockerId}
            onChange={(e) => setLockerId(e.target.value)}
            required
          />
        </label>
        <label className={label}>
          Pickup code
          <input
            className={input}
            value={pickupCode}
            onChange={(e) => setPickupCode(e.target.value)}
            required
          />
        </label>
        <details className="text-sm text-zinc-600">
          <summary className="cursor-pointer select-none">Demo: simulate retrieve time (dev API only)</summary>
          <label className={`${label} mt-2`}>
            Retrieve at
            <input
              type="datetime-local"
              className={input}
              value={simulatedNow}
              onChange={(e) => setSimulatedNow(e.target.value)}
            />
          </label>
        </details>
        <button type="submit" className={btnPrimary} disabled={busy}>
          Retrieve
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {lastCharge !== null && (
        <p className="mt-3 text-sm text-green-800">
          Storage charge: <span className="font-semibold">{lastCharge}</span>
        </p>
      )}
    </Panel>
  );
}
