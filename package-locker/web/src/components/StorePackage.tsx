import { useState } from 'react';
import { useLockerStore } from '../store/locker-store';
import type { PackageSize } from '../types';
import { Panel } from './Panel';
import { Spinner } from './Spinner';

const SIZES: PackageSize[] = ['SMALL', 'MEDIUM', 'LARGE'];

const label = 'flex flex-col gap-1 text-sm text-zinc-700';
const input =
  'rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500';
const btnPrimary =
  'inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 sm:w-auto';

export function StorePackage() {
  const [size, setSize] = useState<PackageSize>('SMALL');
  const busy = useLockerStore((s) => s.storeBusy);
  const error = useLockerStore((s) => s.storeError);
  const lastStored = useLockerStore((s) => s.lastStored);
  const storePackage = useLockerStore((s) => s.storePackage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await storePackage(size);
  }

  return (
    <Panel title="Store package (delivery)">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className={label}>
          Size
          <select
            className={input}
            value={size}
            onChange={(e) => setSize(e.target.value as PackageSize)}
            disabled={busy}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={btnPrimary} disabled={busy}>
          {busy && <Spinner onDark />}
          {busy ? 'Storing…' : 'Store'}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {lastStored && !busy && (
        <div className="mt-3 space-y-1 rounded-md bg-green-50 p-3 text-sm text-green-800">
          <p>
            Locker: <span className="font-mono font-semibold">{lastStored.lockerId}</span>
          </p>
          <p>
            Pickup code: <span className="font-mono font-semibold">{lastStored.pickupCode}</span>
          </p>
        </div>
      )}
    </Panel>
  );
}
